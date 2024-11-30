# Getting Started with AI Recipes

This guide will help you get started with using and creating AI workflow recipes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Basic Concepts](#basic-concepts)
- [Your First Recipe](#your-first-recipe)
- [Next Steps](#next-steps)

## Prerequisites

Before you begin, ensure you have:

1. **Required Tools**
   - A GitHub account (for contributing)
   - A text editor (VS Code recommended)
   - [Cursor](https://cursor.sh) (optional, but recommended)

2. **AI Tool Access**
   - Accounts for the AI tools you plan to use
   - Most recipes use consumer/prosumer tools like:
     - ChatGPT
     - Claude
     - Perplexity
     - Google Docs
   - No coding or API keys required!

## Installation

No installation needed for using recipes! Just:

1. **Browse Recipes**
   - Visit [https://yaniv-golan.github.io/ai-recipes/](https://yaniv-golan.github.io/ai-recipes/)
   - Or browse the `recipes` directory on GitHub

2. **Follow Instructions**
   - Each recipe provides step-by-step guidance
   - Use tools through their normal web interfaces
   - No coding required

## Basic Concepts

AI Recipes consists of several key components:

1. **Recipes**
   - Step-by-step workflow instructions
   - Parameters for customization
   - Tool combinations for maximum effect

2. **Tools**
   - AI services (ChatGPT, Claude, etc.)
   - Utility tools (Google Docs, etc.)
   - All used through their normal interfaces

3. **Workflows**
   - Sequences of tool interactions
   - Data flow between steps
   - Optimized for power users

## Your First Recipe

Let's create a simple recipe:

1. **Create Recipe Directory**

   ```
   recipes/your-username/hello-world/
   ```

2. **Create Recipe Files**

   ```yaml
   # recipe.yaml
   name: Hello World
   description: A simple example recipe
   author: your-username
   parameters:
     - name: greeting
       description: What to say hello to
       example: World

   workflow:
     - id: greet
       name: Generate Greeting
       tool: claude
       tool_usage: |
         1. Open Claude in your browser
         2. Copy and paste this prompt:
         3. Review and refine the greeting
       prompt: |
         Create a friendly greeting for {{greeting}}.
   ```

## Creating Workflows

### Step References

Recipes support cross-step references using the `#step_id` syntax. This makes it easy to:

- Track data flow between steps
- Understand step dependencies
- Create clear, maintainable workflows

When viewing the generated documentation, step references are automatically formatted to show:

- "the previous step (1. Step Name)" for the immediately preceding step
- "the next step (3. Step Name)" for the immediately following step
- "step 2 (Step Name)" for other steps

This helps users understand both the sequence and relationships between steps.

#### Example

```yaml
workflow:
  - id: data_collection
    name: Collect Data
    tool: perplexity
    output_handling: Save results for #analysis

  - id: analysis
    name: Analyze Data
    tool: claude
    input_source: Research data from #data_collection
    tool_usage: |
      1. Review the data from #data_collection
      2. Generate insights...
    output_handling: Save analysis for #report

  - id: report
    name: Generate Report
    tool: chatgpt
    input_source: Analysis from #analysis
```

In this example:

- Each step clearly shows where its input comes from
- Output handling specifies which step will use the data
- Tool usage instructions reference specific steps
- The workflow's data flow is easy to follow

## Next Steps

1. **Learn More**
   - Read [Creating Recipes](creating-recipes.md)
   - Explore [Tool Usage](tool-usage.md)
   - Study [Example Recipes](examples.md)

2. **Get Help**
   - Ask in [GitHub Discussions](https://github.com/yaniv-golan/ai-recipes/discussions)
   - Check [Common Issues](troubleshooting.md)
   - Read the [FAQ](faq.md)

3. **Contribute**
   - Read [Contributing Guidelines](contributing.md)
   - Submit your recipes
   - Report issues

## About the Project

AI Recipes was created in a few hours using [Cursor](https://cursor.sh) v0.43.5, demonstrating the power of AI-assisted development. The entire application, including the web interface, documentation, and recipe processing system, was built with Cursor's help.

You can contribute to both:

- Recipe collection (no coding required)
- Application codebase (React/TypeScript)
