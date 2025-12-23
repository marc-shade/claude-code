#!/usr/bin/env python3
"""
Capability Embeddings Index - Crawls and indexes all Claude Code capabilities.

Indexes:
- Commands (~/.claude/commands/*.md)
- Agents (~/.claude/agents/*.md)
- Skills (~/.claude/skills/*/SKILL.md)
- MCP Tools (from ~/.claude.json and .mcp.json)

Uses SAFLA for embeddings and stores in enhanced-memory for semantic search.
"""

import os
import json
import hashlib
import re
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple

# Configuration
CLAUDE_HOME = Path.home() / ".claude"
INDEX_FILE = CLAUDE_HOME / "capability-index.json"
INDEX_VERSION = "1.0.0"

def extract_markdown_description(content: str) -> str:
    """Extract description from markdown file (first paragraph or header section)."""
    lines = content.strip().split('\n')
    description_lines = []
    in_description = False

    for line in lines:
        # Skip title
        if line.startswith('# '):
            in_description = True
            continue

        # Stop at next section
        if line.startswith('## ') and description_lines:
            break

        if in_description:
            # Skip empty lines at start
            if not description_lines and not line.strip():
                continue
            # Stop at code block
            if line.startswith('```'):
                break
            description_lines.append(line)
            # Stop after first paragraph
            if line.strip() == '' and description_lines:
                break

    return ' '.join(description_lines).strip()[:500]

def extract_command_info(filepath: Path) -> Dict:
    """Extract command information from markdown file."""
    content = filepath.read_text()
    name = filepath.stem

    # Extract description
    description = extract_markdown_description(content)

    # Extract usage patterns
    usage_match = re.search(r'```(?:bash|shell)?\n(.*?)```', content, re.DOTALL)
    usage = usage_match.group(1).strip() if usage_match else ""

    return {
        "type": "command",
        "name": name,
        "path": str(filepath),
        "description": description,
        "usage": usage[:200],
        "searchable_text": f"command {name} {description} {usage}"
    }

def extract_agent_info(filepath: Path) -> Dict:
    """Extract agent information from markdown file."""
    content = filepath.read_text()
    name = filepath.stem

    description = extract_markdown_description(content)

    # Extract capabilities section
    capabilities_match = re.search(r'## (?:Capabilities|When to Use)(.*?)(?:##|$)', content, re.DOTALL | re.IGNORECASE)
    capabilities = capabilities_match.group(1).strip()[:300] if capabilities_match else ""

    return {
        "type": "agent",
        "name": name,
        "path": str(filepath),
        "description": description,
        "capabilities": capabilities,
        "searchable_text": f"agent {name} {description} {capabilities}"
    }

def extract_skill_info(skill_dir: Path) -> Optional[Dict]:
    """Extract skill information from SKILL.md file."""
    skill_file = skill_dir / "SKILL.md"
    if not skill_file.exists():
        return None

    content = skill_file.read_text()
    name = skill_dir.name

    description = extract_markdown_description(content)

    # Extract auto-invocation triggers
    triggers_match = re.search(r'## (?:Auto-Invocation|Triggers?)(.*?)(?:##|$)', content, re.DOTALL | re.IGNORECASE)
    triggers = triggers_match.group(1).strip()[:200] if triggers_match else ""

    return {
        "type": "skill",
        "name": name,
        "path": str(skill_file),
        "description": description,
        "triggers": triggers,
        "searchable_text": f"skill {name} {description} {triggers}"
    }

def extract_mcp_tools(config_path: Path) -> List[Dict]:
    """Extract MCP tool information from config file."""
    if not config_path.exists():
        return []

    try:
        config = json.loads(config_path.read_text())
    except json.JSONDecodeError:
        return []

    tools = []
    mcp_servers = config.get("mcpServers", {})

    for server_name, server_config in mcp_servers.items():
        # Extract tool hints from args or description
        args = server_config.get("args", [])
        description = f"MCP server: {server_name}"

        # Try to infer capabilities from server name and args
        capabilities = []
        if "memory" in server_name.lower():
            capabilities.append("memory storage and retrieval")
        if "voice" in server_name.lower():
            capabilities.append("text-to-speech and speech-to-text")
        if "search" in server_name.lower():
            capabilities.append("search and discovery")
        if "runtime" in server_name.lower() or "agent" in server_name.lower():
            capabilities.append("agent orchestration and task management")
        if "thinking" in server_name.lower():
            capabilities.append("reasoning and analysis")

        tools.append({
            "type": "mcp_server",
            "name": server_name,
            "path": str(config_path),
            "description": description,
            "capabilities": ", ".join(capabilities) if capabilities else "general MCP server",
            "searchable_text": f"mcp server {server_name} {description} {' '.join(capabilities)}"
        })

    return tools

def compute_content_hash(capabilities: List[Dict]) -> str:
    """Compute hash of all capability content for change detection."""
    content = json.dumps(capabilities, sort_keys=True)
    return hashlib.sha256(content.encode()).hexdigest()[:16]

def load_existing_index() -> Optional[Dict]:
    """Load existing index if present."""
    if INDEX_FILE.exists():
        try:
            return json.loads(INDEX_FILE.read_text())
        except json.JSONDecodeError:
            return None
    return None

def crawl_all_capabilities() -> List[Dict]:
    """Crawl all capability sources and return list of capabilities."""
    capabilities = []

    # Crawl commands
    commands_dir = CLAUDE_HOME / "commands"
    if commands_dir.exists():
        for cmd_file in commands_dir.glob("*.md"):
            try:
                capabilities.append(extract_command_info(cmd_file))
            except Exception as e:
                print(f"  Warning: Failed to parse {cmd_file}: {e}")

    # Crawl agents
    agents_dir = CLAUDE_HOME / "agents"
    if agents_dir.exists():
        for agent_file in agents_dir.glob("*.md"):
            try:
                capabilities.append(extract_agent_info(agent_file))
            except Exception as e:
                print(f"  Warning: Failed to parse {agent_file}: {e}")

    # Crawl skills
    skills_dir = CLAUDE_HOME / "skills"
    if skills_dir.exists():
        for skill_dir in skills_dir.iterdir():
            if skill_dir.is_dir():
                try:
                    skill_info = extract_skill_info(skill_dir)
                    if skill_info:
                        capabilities.append(skill_info)
                except Exception as e:
                    print(f"  Warning: Failed to parse {skill_dir}: {e}")

    # Crawl MCP configs
    for config_path in [Path.home() / ".claude.json", Path.home() / ".mcp.json"]:
        try:
            capabilities.extend(extract_mcp_tools(config_path))
        except Exception as e:
            print(f"  Warning: Failed to parse {config_path}: {e}")

    return capabilities

def generate_embeddings(capabilities: List[Dict]) -> List[Dict]:
    """Generate embeddings for each capability using SAFLA."""
    # Note: In production, this would call SAFLA MCP
    # For now, we prepare the data structure for embedding generation

    for cap in capabilities:
        # Mark as needing embedding
        cap["embedding_status"] = "pending"
        cap["embedding_text"] = cap["searchable_text"]

    return capabilities

def save_index(capabilities: List[Dict], content_hash: str):
    """Save the capability index to disk."""
    index = {
        "version": INDEX_VERSION,
        "generated_at": datetime.now().isoformat(),
        "content_hash": content_hash,
        "capability_count": len(capabilities),
        "by_type": {
            "commands": len([c for c in capabilities if c["type"] == "command"]),
            "agents": len([c for c in capabilities if c["type"] == "agent"]),
            "skills": len([c for c in capabilities if c["type"] == "skill"]),
            "mcp_servers": len([c for c in capabilities if c["type"] == "mcp_server"])
        },
        "capabilities": capabilities
    }

    INDEX_FILE.write_text(json.dumps(index, indent=2))
    return index

def main():
    """Main indexing function."""
    print("Capability Index - Crawling all Claude Code capabilities...")

    # Load existing index
    existing = load_existing_index()

    # Crawl all capabilities
    capabilities = crawl_all_capabilities()
    content_hash = compute_content_hash(capabilities)

    # Check if reindex needed
    if existing and existing.get("content_hash") == content_hash:
        print(f"  Index up-to-date ({len(capabilities)} capabilities)")
        return existing

    # Generate embeddings
    capabilities = generate_embeddings(capabilities)

    # Save index
    index = save_index(capabilities, content_hash)

    print(f"  Indexed {index['capability_count']} capabilities:")
    print(f"    - {index['by_type']['commands']} commands")
    print(f"    - {index['by_type']['agents']} agents")
    print(f"    - {index['by_type']['skills']} skills")
    print(f"    - {index['by_type']['mcp_servers']} MCP servers")

    return index

if __name__ == "__main__":
    main()
