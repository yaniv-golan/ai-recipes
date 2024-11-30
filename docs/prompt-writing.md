# Writing Prompts for AI Recipes

This guide explains how to write effective prompts for AI tools in your recipes. Good prompts are clear, structured, and make effective use of parameters.

## Table of Contents

- [Basic Syntax](#basic-syntax)
- [Parameter Usage](#parameter-usage)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Basic Syntax

### Parameter Format

Parameters use double curly braces:

```yaml
prompt: |
  Analyze the market for {{product_name}}
```

Parameters must:

- Start with a letter
- Contain only letters, numbers, and underscores
- Match parameters defined in recipe.yaml

### Parameter Display

In the UI:

- Parameters are highlighted in yellow
- Undefined parameters show: `{{parameter_name}}`
- Defined parameters show their value

## Parameter Usage

### Naming Conventions

1. **Descriptive Names**
   - Use: `{{target_market}}`, `{{time_period}}`
   - Avoid: `{{param1}}`, `{{x}}`

2. **Consistent Style**
   - Use snake_case: `{{market_segment}}`
   - Avoid mixed styles: `{{marketSegment}}`

3. **Clear Purpose**
   - Name should indicate content: `{{competitor_list}}`
   - Avoid vague names: `{{input}}`

### XML-Style Tags

For clarity, you may want to wrap parameters in descriptive tags:

```yaml
prompt: |
  <market_segment>
  {{market_segment}}
  </market_segment>
```

## Best Practices

### 1. Clear Structure

Use consistent sections:

```yaml
prompt: |
  **Role:** Market research analyst
  **Task:** Analyze market trends
  **Context:** {{market_context}}
  **Output Format:** Bullet points
```

### 2. Formatting

- Use markdown for structure
- Include line breaks between sections
- Maintain consistent indentation
- Use lists for multiple items

### 3. Output Instructions

Always specify:

- Required format
- Expected length
- Level of detail
- Any special requirements

## Examples

### Market Analysis Prompt

```yaml
prompt: |
  **Role:** You are a market research specialist tasked with analyzing market trends.

  **Target Market:**
  <market>
  {{target_market}}
  </market>

  **Time Period:**
  <period>
  {{time_period}}
  </period>

  **Analysis Requirements:**
  - Market size and growth
  - Key competitors
  - Consumer trends
  - Technology impact
  - Regulatory factors

  **Output Format:**
  - Use bullet points
  - Include relevant statistics
  - Cite data sources
  - Maximum 500 words
```

### Query Generation Prompt

```yaml
prompt: |
  **Task:** Generate search queries for market research.

  **Focus Area:**
  <focus>
  {{research_focus}}
  </focus>

  **Parameters:**
  - Number of queries: {{num_queries}}
  - Time frame: {{time_period}}
  - Geographic focus: {{region}}

  **Query Requirements:**
  - One query per line
  - Include market context
  - Target specific data points
  - Use boolean operators when helpful
```

## Common Issues

1. **Parameter Validation**
   - Parameters must be defined in recipe.yaml
   - Names are case-sensitive
   - No spaces allowed in names

2. **Formatting Issues**
   - Use YAML pipe (`|`) for multi-line prompts
   - Maintain consistent indentation
   - Close all markdown formatting

3. **UI Display**
   - Long prompts may need scrolling
   - Parameters are always highlighted
   - Markdown formatting is preserved

```
</rewritten_file>
