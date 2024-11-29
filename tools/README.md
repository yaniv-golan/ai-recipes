# Tools Directory

This directory contains the configuration and assets for each AI tool used in the recipes.

## Directory Structure

Each tool has its own directory containing:

- `tool.yaml` - Tool configuration and metadata
- `icon.svg` or `icon.webp` - Tool icon (SVG preferred)

Example:

```
tools/
├── README.md
├── default-icon.svg
├── claude/
│   ├── tool.yaml
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

## Icon Requirements

- Format: SVG preferred, WebP supported as fallback
- Size: Square aspect ratio, minimum 32x32 pixels
- Location: Must be named `icon.svg` or `icon.webp` in the tool's directory
- Default: `default-icon.svg` is used when a tool's icon is missing

## Build Process

The `web/scripts/process-recipes.js` script:

1. Reads tool configurations from `tool.yaml` files
2. Copies icons to `web/public/tools/[toolname]/`
3. Generates URLs in the format `./tools/[toolname]/icon.[svg|webp]`

## Adding a New Tool

1. Create a new directory with the tool's ID
2. Add `tool.yaml` following the schema in `schema/tool-schema.json`
3. Add `icon.svg` (preferred) or `icon.webp`
4. Run `npm run build` in the `web` directory to process the changes
