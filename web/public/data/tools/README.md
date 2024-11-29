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
│   ├── tool.yaml    # Only contains id, name, description
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

- `tool.yaml` files only contain identity information about the tool
- Available models and settings are defined in `schema/tools/*.json`
- Recipes specify which models and settings they need for each workflow step
- Settings in recipes can be:
  - `true` - Feature must be enabled
  - `false` - Feature must be disabled
  - Not specified - Feature doesn't matter for this workflow step

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
5. Run `npm run build` in the `web` directory to process the changes
