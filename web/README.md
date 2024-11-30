# AI Recipes Web Interface

A React-based web application for creating and managing AI workflow recipes.

## Features

- Create and edit AI workflow recipes
- Dynamic tool configuration loading
- Real-time schema validation
- Interactive workflow step editor
- Recipe preview and export

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up development environment:

```bash
# Copy tool configurations
./scripts/sync-tools.sh

# Start development server
npm run dev
```

## Development

The project uses:

- Vite for development and building
- React with TypeScript
- Tailwind CSS for styling
- JSON Schema for validation

### Project Structure

```
web/
├── public/
│   └── data/        # Generated tool and recipe data
│       ├── tools/   # Tool configurations, icons, and assets
│       └── schemas/ # JSON schemas for validation
├── src/
│   ├── components/  # React components
│   │   ├── MetadataForm.tsx      # Recipe metadata editor
│   │   ├── ParametersForm.tsx    # Recipe parameters editor
│   │   ├── ToolsForm.tsx         # Tool configuration editor
│   │   └── WorkflowStepsForm.tsx # Workflow steps editor
│   ├── pages/       # Page components
│   ├── types/       # TypeScript types
│   └── utils/
│       └── tools.ts # Dynamic tool configuration loader
└── scripts/         # Build scripts
```

### Tool Configuration

Tools are configured through multiple layers:

1. Base Configuration (`tool.yaml`):
   - Basic tool identity (id, name, description)
   - Icon specification

2. Schema Definition (`schema/tools/*.json`):
   - Required fields (tool_usage, prompt for AI tools)
   - Available settings with descriptions
   - Model options if applicable

3. Dynamic Loading (`src/utils/tools.ts`):
   - Loads tool configurations at runtime
   - Validates against schemas
   - Provides type-safe settings interface

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run process-recipes` - Process recipe files
- `npm run lint` - Run ESLint

## Building and Deployment

1. Process recipes and tool configurations:

```bash
# Sync tool configurations (if needed)
./scripts/sync-tools.sh

# Process recipes
npm run process-recipes
```

2. Build the application:

```bash
npm run build
```

3. Deploy (automated via GitHub Actions):

- Pushes to main branch trigger deployment
- Tool configurations are automatically synced
- Uses GitHub Pages for hosting
- Accessible at /ai-recipes/

## Adding New Tools

See the [tools README](../tools/README.md) for detailed instructions on adding new tools.
