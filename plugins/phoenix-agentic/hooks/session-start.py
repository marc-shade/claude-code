#!/usr/bin/env python3
"""
Phoenix Agentic System - Session Start Hook
Initializes the agentic environment and provides environmental awareness.
Includes hyperthink electric blue pulse visualization.
"""

import json
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

# Electric Blue ANSI color codes
ELECTRIC_BLUE = "\033[38;2;0;212;255m"
ELECTRIC_BLUE_BRIGHT = "\033[38;2;0;255;255m"
ELECTRIC_BLUE_DIM = "\033[38;2;0;136;170m"
ELECTRIC_BLUE_GLOW = "\033[1m\033[38;2;0;212;255m"
RESET = "\033[0m"

def electric_blue_pulse(text, intensity=1.0):
    """Apply electric blue color with variable intensity."""
    g = int(136 + (255 - 136) * intensity)
    b = int(170 + (255 - 170) * intensity)
    return f"\033[38;2;0;{g};{b}m{text}{RESET}"

def show_hyperthink_banner():
    """Display hyperthink electric blue banner."""
    banner = """
    ╔═══════════════════════════════════════════════════════════════╗
    ║  ⚡ HYPERTHINK MODE ⚡                                         ║
    ║                                                               ║
    ║  Steve Jobs-Inspired Deep Thinking Methodology                ║
    ║  Making a dent in the universe...                             ║
    ╚═══════════════════════════════════════════════════════════════╝
    """
    print(f"{ELECTRIC_BLUE_GLOW}{banner}{RESET}")

def show_thinking_hierarchy():
    """Display thinking depth hierarchy with colors."""
    print(f"\n{ELECTRIC_BLUE}Thinking Depth Hierarchy:{RESET}")
    print(f"  {ELECTRIC_BLUE_GLOW}hyperthink{RESET} (64K) ████████ ⚡")
    print(f"  \033[38;5;208multrathink{RESET} (32K) ██████░░")
    print(f"  \033[33mthink harder{RESET} (16K) ████░░░░")
    print(f"  \033[90mthink{RESET} (8K) ██░░░░░░\n")

def check_mcp_servers():
    """Check status of essential MCP servers."""
    servers = {
        "enhanced-memory": {"port": None, "status": "unknown"},
        "voice-mode": {"port": None, "status": "unknown"},
        "agent-runtime-mcp": {"port": None, "status": "unknown"},
        "sequential-thinking": {"port": None, "status": "unknown"},
    }

    # Check for running MCP processes
    try:
        result = subprocess.run(
            ["pgrep", "-fl", "mcp"],
            capture_output=True,
            text=True,
            timeout=5
        )
        running = result.stdout.lower()
        for server in servers:
            if server.replace("-", "") in running.replace("-", ""):
                servers[server]["status"] = "running"
    except Exception:
        pass

    return servers

def check_voice_services():
    """Check TTS/STT service availability."""
    services = {
        "whisper": {"url": "http://localhost:8100", "status": "unknown"},
        "kokoro": {"url": "http://localhost:8880", "status": "unknown"},
        "livekit": {"url": "ws://localhost:7880", "status": "unknown"},
    }

    import urllib.request
    for name, info in services.items():
        try:
            if name == "livekit":
                continue  # WebSocket check would be different
            req = urllib.request.Request(info["url"], method="HEAD")
            urllib.request.urlopen(req, timeout=2)
            services[name]["status"] = "healthy"
        except Exception:
            services[name]["status"] = "unavailable"

    return services

def check_cluster_nodes():
    """Check cluster node availability."""
    nodes = {
        "mac-studio": {"role": "orchestrator", "status": "local"},
        "macbook-air": {"role": "researcher", "status": "unknown"},
        "macpro51": {"role": "builder", "status": "unknown"},
    }

    # Simple ping check
    for node in ["macbook-air", "macpro51"]:
        try:
            result = subprocess.run(
                ["ping", "-c", "1", "-W", "1", node],
                capture_output=True,
                timeout=3
            )
            nodes[node]["status"] = "online" if result.returncode == 0 else "offline"
        except Exception:
            nodes[node]["status"] = "offline"

    return nodes

def get_storage_status():
    """Check storage availability."""
    storage = {
        "hot": {"path": "/Volumes/SSDRAID0", "status": "unknown"},
        "cold": {"path": "/Volumes/FILES", "status": "unknown"},
    }

    for tier, info in storage.items():
        if os.path.exists(info["path"]):
            storage[tier]["status"] = "mounted"
        else:
            storage[tier]["status"] = "unavailable"

    return storage

def main():
    """Generate session start context."""

    # Check for hyperthink mode activation
    hyperthink_mode = os.environ.get("HYPERTHINK_MODE", "").lower() == "true"
    hyperthink_trigger = any(arg in sys.argv for arg in ["--hyperthink", "-ht", "hyperthink"])

    if hyperthink_mode or hyperthink_trigger:
        show_hyperthink_banner()
        show_thinking_hierarchy()
        print(electric_blue_pulse("  Think Different. Obsess. Craft. Ship Magic.", 0.8))
        print()

    context = {
        "timestamp": datetime.now().isoformat(),
        "session_type": "phoenix_agentic",
        "hyperthink_active": hyperthink_mode or hyperthink_trigger,
        "environment": {
            "hostname": os.uname().nodename,
            "user": os.environ.get("USER", "unknown"),
            "cwd": os.getcwd(),
        },
        "mcp_servers": check_mcp_servers(),
        "voice_services": check_voice_services(),
        "cluster_nodes": check_cluster_nodes(),
        "storage": get_storage_status(),
    }

    # Determine overall health
    issues = []

    # Check critical services
    voice = context["voice_services"]
    if voice["whisper"]["status"] != "healthy":
        issues.append("Whisper STT unavailable")
    if voice["kokoro"]["status"] != "healthy":
        issues.append("Kokoro TTS unavailable")

    storage = context["storage"]
    if storage["hot"]["status"] != "mounted":
        issues.append("Hot storage (SSDRAID0) not mounted")

    context["healthy"] = len(issues) == 0
    context["issues"] = issues

    # Recommendations
    recommendations = []
    if not context["healthy"]:
        recommendations.append("Run /system-status for detailed diagnostics")

    context["recommendations"] = recommendations

    # Output for Claude Code
    print(f"=== Phoenix Agentic Session Start {datetime.now().strftime('%c')} ===")
    print(json.dumps(context, indent=2))

    return 0 if context["healthy"] else 1

if __name__ == "__main__":
    sys.exit(main())
