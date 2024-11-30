# Writing description.md Files

This guide explains how to write effective `description.md` files for AI recipes. The description file provides a concise overview of your recipe and is automatically incorporated into the generated `README.md`.

## File Structure

### Heading Levels

1. Start with an H1 (`# Title`) matching your recipe's name - this will be used as the main title
2. Use `## Section` (H2) for major sections like Overview, Benefits
3. Use `### Subsection` (H3) for subsections when needed
4. Avoid going deeper than H3 for clarity

### Content Sections

1. **Title (H1)**
   - Must match the recipe name from recipe.yaml
   - Will be used as the main page title

2. **Opening Paragraph**
   - Brief, clear overview of the recipe
   - What problem it solves
   - Key benefits

3. **Overview Section** (H2)
   - Tools used and their roles
   - Workflow summary
   - Expected outcomes

4. **Key Benefits** (H2)
   - Bullet points or numbered list
   - Focus on practical outcomes
   - Include metrics when possible

## Formatting Guidelines

### Lists

- Use bullet points (`-`) for unordered lists
- Use numbers (`1.`) for sequential steps
- Indent sublists with 2 spaces

### Emphasis

- Use bold (`**text**`) for important terms
- Use backticks (`` `code` ``) for tool names, commands
- Use blockquotes (`>`) for important notes

## Best Practices

1. **Keep it Concise**
   - Aim for 2-3 paragraphs per section
   - Use clear, direct language
   - Avoid technical jargon unless necessary

2. **Focus on Value**
   - Highlight practical benefits
   - Include real-world use cases
   - Mention target audience

3. **Maintain Consistency**
   - Use consistent terminology
   - Follow the same structure across sections
   - Match style with other recipes

## Example

```markdown
# Market Analysis Workflow

This workflow combines AI tools to produce comprehensive market research reports, helping businesses understand market dynamics and opportunities.

## Overview

The workflow uses three AI tools in sequence:
- Claude for developing research queries
- Perplexity for gathering market data
- ChatGPT for synthesizing findings

## Key Benefits

1. **Comprehensive Coverage**
   - Market size and growth analysis
   - Competitive landscape insights
   - Consumer behavior patterns

2. **Time Efficiency**
   - Automated data gathering
   - Structured analysis process
   - Quick report generation
```

The description.md file is rendered using GitHub Flavored Markdown (GFM) in the web application. The H1 title from your description.md will be used as the main page title, so make sure it matches your recipe name in recipe.yaml.
