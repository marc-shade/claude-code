#!/bin/bash
# Install Marc's Claude Code plugins to the user's Claude configuration
# This script symlinks the plugins from this repo to ~/.claude/plugins/

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
CLAUDE_PLUGINS_DIR="$HOME/.claude/plugins"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  ⚡ Installing Marc's Claude Code Plugins ⚡                   ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Create plugins directory if it doesn't exist
mkdir -p "$CLAUDE_PLUGINS_DIR"

# List of plugins to install
PLUGINS=(
    "phoenix-agentic"
    "capability-index"
    "cluster-orchestration"
    "dynamic-context"
    "execution-telemetry"
    "intent-router"
    "memory-commands"
    "production-enforcer"
    "relay-race-protocol"
    "voice-first-workflow"
)

echo "Installing plugins from: $REPO_DIR/plugins/"
echo "Installing to: $CLAUDE_PLUGINS_DIR/"
echo ""

installed=0
skipped=0

for plugin in "${PLUGINS[@]}"; do
    source_path="$REPO_DIR/plugins/$plugin"
    target_path="$CLAUDE_PLUGINS_DIR/$plugin"

    if [ -d "$source_path" ]; then
        if [ -L "$target_path" ]; then
            echo "  ⟳ $plugin (already linked)"
            ((skipped++))
        elif [ -d "$target_path" ]; then
            echo "  ⚠ $plugin (directory exists - backup and remove to install)"
            ((skipped++))
        else
            ln -s "$source_path" "$target_path"
            echo "  ✓ $plugin (installed)"
            ((installed++))
        fi
    else
        echo "  ✗ $plugin (not found in repo)"
    fi
done

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  Installed: $installed plugins"
echo "  Skipped: $skipped plugins"
echo ""
echo "  To activate plugins, restart Claude Code or run:"
echo "    claude --reload"
echo ""
echo "  To use hyperthink:"
echo "    /hyperthink"
echo "    or set: HYPERTHINK_MODE=true"
echo "════════════════════════════════════════════════════════════════"
