# Tools Directory

This directory contains the identity information and assets for each AI tool used in the recipes.

## Directory Structure

Each tool has its own directory containing:

- `tool.yaml` - Tool identity information (id, name, description)
- `icon.svg` or `icon.webp` - Tool icon (SVG preferred)

Example:

```
tools/
├── README.md
├── default-icon.svg
├── claude/
│   ├── tool.yaml    # Contains id, name, description
│   └── icon.svg
├── chatgpt/
│   ├── tool.yaml
│   └── icon.svg
├── perplexity/
│   ├── tool.yaml
│   └── icon.svg
└── google_docs/
    ├── tool.yaml
    └── icon.webp
```

## Tool Configuration

### Tool Identity (tool.yaml)

- Basic information about the tool:
  - `id`: Unique identifier (lowercase, alphanumeric with hyphens)
  - `name`: Display name
  - `description`: Brief description of the tool
  - `icon`: Icon filename (icon.svg or icon.webp)

### Tool Schema (schema/tools/*.json)

- Defines the tool's capabilities and requirements:
  - Required fields:
    - `tool_usage`: How the tool should be used in a workflow step
    - `prompt`: The prompt template for AI tools (required for AI tools)
  - Optional fields:
    - `model`: Available AI models (specific to each tool)
    - `settings`: Tool-specific settings with descriptions

### Settings Configuration

Settings in recipes can be:

- `true` - Feature must be enabled
- `false` - Feature must be disabled
- `null` - Feature doesn't matter for this workflow step

Available settings vary by tool:

- ChatGPT: `enable_web_search`
- Claude: `enable_artifacts`, `enable_analysis`, `enable_latex`
- Perplexity: `focus` (Web/Academic/Math/Writing/Video/Social), `enable_pro`
- Google Docs: `enable_markdown`

## Dynamic Schema Loading

The web application dynamically loads tool schemas to:

1. Validate workflow steps
2. Determine required fields
3. Configure available settings
4. Set model options

## Icon Requirements

- Format: SVG preferred, WebP supported as fallback
- Size: Square aspect ratio, minimum 32x32 pixels
- Location: Must be named `icon.svg` or `icon.webp` in the tool's directory
- Default: `default-icon.svg` is used when a tool's icon is missing

## Adding a New Tool

1. Create a new directory with the tool's ID
2. Add `tool.yaml` with tool identity information
3. Add corresponding schema in `schema/tools/[toolname].json`
4. Add `icon.svg` (preferred) or `icon.webp`
5. Run `./scripts/sync-tools.sh` to sync configurations
6. Run `npm run build` in the `web` directory to process the changes

## Development Workflow

The `sync-tools.sh` script automates the synchronization of tool configurations:

- Copies tool assets to web/public/data/tools
- Copies schemas to web/public/data/schemas

Usage:

```bash
./scripts/sync-tools.sh
```

This script works in conjunction with the GitHub Actions workflow that runs automatically when tool configurations change.
