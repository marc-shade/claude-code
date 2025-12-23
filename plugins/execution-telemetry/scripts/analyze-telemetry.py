#!/usr/bin/env python3
"""
Telemetry Analyzer - Analyzes execution patterns and generates insights.

Identifies:
- Tool chains and sequences
- Failure patterns
- Parallelization opportunities
- Performance bottlenecks
"""

import json
from collections import defaultdict, Counter
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Tuple
import statistics

TELEMETRY_FILE = Path.home() / ".claude" / "execution-telemetry.jsonl"

def load_telemetry(days: int = 7) -> List[Dict]:
    """Load telemetry records from the last N days."""
    if not TELEMETRY_FILE.exists():
        return []

    cutoff = datetime.now() - timedelta(days=days)
    records = []

    with open(TELEMETRY_FILE) as f:
        for line in f:
            try:
                record = json.loads(line.strip())
                timestamp = datetime.fromisoformat(record.get("timestamp", ""))
                if timestamp >= cutoff:
                    records.append(record)
            except (json.JSONDecodeError, ValueError):
                continue

    return records

def calculate_stats(records: List[Dict]) -> Dict:
    """Calculate overall statistics."""
    if not records:
        return {}

    total = len(records)
    successes = sum(1 for r in records if r.get("outcome") == "success")
    latencies = [r.get("latency_ms", 0) for r in records if r.get("latency_ms")]

    return {
        "total_calls": total,
        "success_rate": successes / total if total > 0 else 0,
        "avg_latency_ms": statistics.mean(latencies) if latencies else 0,
        "p50_latency_ms": statistics.median(latencies) if latencies else 0,
        "p95_latency_ms": sorted(latencies)[int(len(latencies) * 0.95)] if len(latencies) > 20 else 0
    }

def calculate_per_tool_stats(records: List[Dict]) -> Dict[str, Dict]:
    """Calculate statistics per tool."""
    tool_records = defaultdict(list)

    for record in records:
        tool_name = record.get("tool_name", "unknown")
        tool_records[tool_name].append(record)

    stats = {}
    for tool_name, tool_recs in tool_records.items():
        total = len(tool_recs)
        successes = sum(1 for r in tool_recs if r.get("outcome") == "success")
        latencies = [r.get("latency_ms", 0) for r in tool_recs if r.get("latency_ms")]

        stats[tool_name] = {
            "calls": total,
            "success_rate": successes / total if total > 0 else 0,
            "avg_latency_ms": statistics.mean(latencies) if latencies else 0,
            "failures": [r.get("error") for r in tool_recs if r.get("outcome") == "failure"][:5]
        }

    return stats

def identify_chains(records: List[Dict], min_occurrences: int = 5) -> List[Tuple[Tuple[str, ...], int]]:
    """Identify frequently occurring tool chains."""
    # Group by session
    sessions = defaultdict(list)
    for record in records:
        session_id = record.get("session_id", "unknown")
        sessions[session_id].append(record)

    # Extract chains of length 2-4
    chain_counts = Counter()

    for session_records in sessions.values():
        # Sort by timestamp
        sorted_recs = sorted(session_records, key=lambda r: r.get("timestamp", ""))
        tool_sequence = [r.get("tool_name") for r in sorted_recs]

        # Count chains
        for chain_len in range(2, 5):
            for i in range(len(tool_sequence) - chain_len + 1):
                chain = tuple(tool_sequence[i:i + chain_len])
                chain_counts[chain] += 1

    # Filter by minimum occurrences
    frequent_chains = [(chain, count) for chain, count in chain_counts.items()
                       if count >= min_occurrences]

    return sorted(frequent_chains, key=lambda x: x[1], reverse=True)[:20]

def identify_failure_patterns(records: List[Dict]) -> Dict[str, List[str]]:
    """Identify common failure patterns by tool."""
    failures = defaultdict(list)

    for record in records:
        if record.get("outcome") == "failure":
            tool_name = record.get("tool_name", "unknown")
            error = record.get("error", "unknown error")
            failures[tool_name].append(error)

    # Get most common errors per tool
    patterns = {}
    for tool_name, errors in failures.items():
        error_counts = Counter(errors)
        patterns[tool_name] = error_counts.most_common(3)

    return patterns

def generate_recommendations(stats: Dict, tool_stats: Dict, chains: List, failures: Dict) -> List[str]:
    """Generate optimization recommendations."""
    recommendations = []

    # Low success rate tools
    for tool, ts in tool_stats.items():
        if ts["success_rate"] < 0.9 and ts["calls"] > 10:
            recommendations.append(
                f"Tool '{tool}' has {ts['success_rate']*100:.1f}% success rate. "
                f"Common errors: {ts['failures'][:2]}"
            )

    # High latency tools
    for tool, ts in tool_stats.items():
        if ts["avg_latency_ms"] > 5000 and ts["calls"] > 5:
            recommendations.append(
                f"Tool '{tool}' averages {ts['avg_latency_ms']:.0f}ms. Consider caching or parallelization."
            )

    # Parallelization opportunities
    sequential_reads = sum(1 for chain, count in chains if chain == ("Read", "Read"))
    if sequential_reads > 10:
        recommendations.append(
            f"Found {sequential_reads} sequential Read pairs. Parallelize for ~50% latency reduction."
        )

    return recommendations

def main():
    """Run full telemetry analysis."""
    print("Loading telemetry data...")
    records = load_telemetry(days=7)

    if not records:
        print("No telemetry data found.")
        return

    print(f"Analyzing {len(records)} records...")

    # Calculate statistics
    overall_stats = calculate_stats(records)
    tool_stats = calculate_per_tool_stats(records)
    chains = identify_chains(records)
    failures = identify_failure_patterns(records)
    recommendations = generate_recommendations(overall_stats, tool_stats, chains, failures)

    # Output results
    print("\n" + "=" * 60)
    print("EXECUTION TELEMETRY ANALYSIS")
    print("=" * 60)

    print(f"\nOVERALL (Last 7 days):")
    print(f"  Total Calls: {overall_stats['total_calls']:,}")
    print(f"  Success Rate: {overall_stats['success_rate']*100:.1f}%")
    print(f"  Avg Latency: {overall_stats['avg_latency_ms']:.0f}ms")
    print(f"  P95 Latency: {overall_stats['p95_latency_ms']:.0f}ms")

    print(f"\nTOP TOOLS BY USAGE:")
    sorted_tools = sorted(tool_stats.items(), key=lambda x: x[1]["calls"], reverse=True)[:10]
    for i, (tool, ts) in enumerate(sorted_tools, 1):
        print(f"  {i}. {tool}: {ts['calls']} calls, {ts['success_rate']*100:.0f}% success, {ts['avg_latency_ms']:.0f}ms avg")

    print(f"\nFREQUENT TOOL CHAINS:")
    for chain, count in chains[:10]:
        print(f"  {' → '.join(chain)}: {count} occurrences")

    print(f"\nFAILURE PATTERNS:")
    for tool, patterns in list(failures.items())[:5]:
        print(f"  {tool}:")
        for error, count in patterns:
            print(f"    - {error[:50]}... ({count}x)")

    print(f"\nRECOMMENDATIONS:")
    for i, rec in enumerate(recommendations[:5], 1):
        print(f"  {i}. {rec}")

if __name__ == "__main__":
    main()
