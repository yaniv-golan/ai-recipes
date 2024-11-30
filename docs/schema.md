# Recipe Schema Reference

This document describes the schema for AI Recipes YAML files. Understanding this schema is essential for creating valid recipes.

## Table of Contents

- [Basic Structure](#basic-structure)
- [Recipe Properties](#recipe-properties)
- [Parameters](#parameters)
- [Workflow Steps](#workflow-steps)
- [Tool Configuration](#tool-configuration)
- [Step References](#step-references)
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
    input_source: Input from #previous_step
    tool_usage: Usage instructions
    output_handling: Save for #next_step
    prompt: Prompt template
    notes: Additional notes
```

### Step Properties

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique step identifier (used in #step_id references) |
| `name` | string | Step name |
| `tool` | object/string | Tool configuration |
| `description` | string | Step description |
| `input_source` | string | Where input comes from (can reference other steps using #step_id) |
| `tool_usage` | string | Usage instructions |
| `output_handling` | string | How output should be handled (can reference other steps using #step_id) |
| `prompt` | string | AI prompt template |
| `notes` | string | Additional notes (can reference other steps using #step_id) |

## Step References

Steps can reference other steps using the `#step_id` syntax. This is used to:

- Specify input sources
- Define output handling
- Reference steps in instructions
- Add context in notes

### Reference Syntax

Use `#step_id` to reference another step. For example:

```yaml
workflow:
  - id: query_generation
    name: Generate Queries
    tool: claude
    output_handling: Save queries for #data_collection

  - id: data_collection
    name: Collect Data
    input_source: Queries from #query_generation
    tool_usage: |
      1. Take the queries from #query_generation
      2. Execute each query...
```

In the generated documentation, references are automatically formatted as:

- "the previous step (1. Step Name)" for the immediately preceding step
- "the next step (3. Step Name)" for the immediately following step
- "step 2 (Step Name)" for other steps

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

### Basic Recipe with Step References

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
    output_handling: Save queries for #execute_research

  - id: execute_research
    name: Execute Research
    tool: perplexity
    input_source: Queries from #generate_queries
    tool_usage: |
      1. Take each query from #generate_queries
      2. Execute in Perplexity
      3. Save results
    output_handling: Compile results for #analyze_data

  - id: analyze_data
    name: Analyze Results
    tool: chatgpt
    input_source: Research results from #execute_research
    tool_usage: |
      1. Review data from #execute_research
      2. Generate analysis report
```

## Validation

The schema is enforced through:

1. JSON Schema validation
2. Runtime checks
3. Pre-commit hooks

For detailed validation rules, see the [schema.json](../schema/recipe-schema.json) file.
