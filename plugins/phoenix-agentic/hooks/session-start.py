#!/usr/bin/env python3
"""
Phoenix Agentic System - Session Start Hook
Initializes the agentic environment and provides environmental awareness.
"""

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path

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
    context = {
        "timestamp": datetime.now().isoformat(),
        "session_type": "phoenix_agentic",
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
