# Recipe Schema Reference

This document describes the schema for AI Recipes YAML files. Understanding this schema is essential for creating valid recipes.

## Table of Contents

- [Basic Structure](#basic-structure)
- [Recipe Properties](#recipe-properties)
- [Parameters](#parameters)
- [Workflow Steps](#workflow-steps)
- [Tool Configuration](#tool-configuration)
- [Examples](#examples)

## Basic Structure

A recipe consists of these main sections:

```yaml
name: Recipe Name
description: Short description
author: username
parameters: []
workflow: []
```

## Recipe Properties

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Recipe name |
| `description` | string | Brief description |
| `author` | string | Recipe creator |
| `workflow` | array | List of workflow steps |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `parameters` | array | List of parameters |
| `tags` | array | Categorization tags |
| `version` | string | Recipe version |

## Parameters

Each parameter has these properties:

```yaml
parameters:
  - name: parameter_name
    description: Parameter description
    required: true
    example: Example value
```

### Parameter Properties

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Parameter identifier |
| `description` | string | Usage explanation |
| `required` | boolean | Whether required |
| `example` | string | Example value |

## Workflow Steps

Each workflow step defines a tool interaction:

```yaml
workflow:
  - id: step_id
    name: Step Name
    tool: tool_name
    description: Step description
    tool_usage: Usage instructions
    prompt: Prompt template
    notes: Additional notes
```

### Step Properties

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique step identifier |
| `name` | string | Step name |
| `tool` | object/string | Tool configuration |
| `description` | string | Step description |
| `tool_usage` | string | Usage instructions |
| `prompt` | string | AI prompt template |
| `notes` | string | Additional notes |

## Tool Configuration

Tools can be specified in two ways:

### Simple Format

```yaml
tool: claude
```

### Detailed Format

```yaml
tool:
  name: claude
  model: claude-2
  settings:
    enable_artifacts: true
```

### Tool Properties

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Tool identifier |
| `model` | string | AI model (if applicable) |
| `settings` | object | Tool-specific settings |

## Examples

### Basic Recipe

```yaml
name: Market Analysis
description: Analyze market trends
author: username
parameters:
  - name: target_market
    description: Market to analyze
    required: true
    example: Smart Home Security

workflow:
  - id: generate_queries
    name: Generate Search Queries
    tool: claude
    prompt: |
      Generate search queries for {{target_market}}
```

### Complex Recipe

```yaml
name: Competitive Analysis
description: Analyze competitors
author: username
version: 1.0.0
tags:
  - market-research
  - competition

parameters:
  - name: company_name
    description: Target company
    required: true
    example: Tesla
  - name: industry
    description: Industry sector
    required: true
    example: Electric Vehicles

workflow:
  - id: research
    name: Market Research
    tool:
      name: perplexity
      settings:
        focus: business
    prompt: |
      Research competitors of {{company_name}}
      in the {{industry}} industry.
    notes: Ensure comprehensive coverage

  - id: analysis
    name: Analysis
    tool:
      name: claude
      model: claude-2
    prompt: |
      Analyze the competitive landscape
      based on the research.
```

## Validation

The schema is enforced through:

1. JSON Schema validation
2. Runtime checks
3. Pre-commit hooks

For detailed validation rules, see the [schema.json](../schema/recipe-schema.json) file.
