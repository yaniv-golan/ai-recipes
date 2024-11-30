# AI Recipes:  Power User Workflows for Maximum Productivity

This repository contains a collection of AI-powered workflow recipes designed to maximize your productivity by combining the strengths of different AI tools.  These recipes provide structured approaches to common tasks, enabling you to achieve complex goals efficiently.

## For Power Users, Not Developers

This repository is specifically for power users of AI tools, *not* for developers.  The recipes here focus on leveraging commercially available, free, or open-source AI tools through their user interfaces—no coding required.  While the future of AI may involve sophisticated agent frameworks that automate these workflows, today's power users still need to get things done.  These recipes empower you to do just that, providing practical, hands-on workflows you can implement immediately.

## Why AI Workflows?

While individual AI tools like ChatGPT, Claude, and Perplexity are powerful on their own, they often excel in specific areas.  Combining these tools in structured workflows unlocks significant productivity gains.  This repository is where AI power users share their most effective workflows.

## Finding and using AI Recipes

If you're comfortable using GitHub and reading the recipes in YAML or README files, great. Keep going.

For mere mortals though, a more accessible version of this repostiory is available [https://yaniv-golan.github.io/ai-recipes/](https://yaniv-golan.github.io/ai-recipes/).

## Repository Structure

```
.
├── .github             # GitHub configuration files
│   ├── ISSUE_TEMPLATE   # Issue templates
│   ├── pull_request_template.md # Pull request template
│   ├── scripts         # Python scripts for repository management
│   └── workflows       # GitHub Actions workflows for automation
├── LICENSE             # MIT License
├── README.md           # This file
├── recipes             # Directory containing AI recipes
│   └── yaniv-golan    # Example user directory
│       ├── competitive-intelligence # Example recipe
│       └── market-analysis        # Another example recipe
├── schema             # JSON schema for validating recipes
└── web                 # Web application for browsing recipes
```

## Recipes

The heart of this repository is the `recipes` directory.  Here you'll find practical, ready-to-use AI workflow recipes.  Each recipe provides detailed instructions, prompts, and examples for specific tasks.

### Contributing Recipes

We encourage you to share your own powerful AI workflows by contributing recipes.

At some point we'll add a recipe authoring tool, but until that day -

#### Recipe Structure

```
recipes/
  <your-github-username>/
    <recipe-name>/
      recipe.yaml
      description.md (optional)
```

* **`recipes/<your-github-username>/`**: Create a directory under `recipes` with your GitHub username.
* **`recipes/<your-github-username>/<recipe-name>/`**:  Create a directory for your recipe with a descriptive, URL-friendly name.
* **`recipe.yaml`**: This **required** file defines the recipe's metadata, parameters, tools, and workflow steps in YAML.  Validate it against `schema/recipe-schema.json`. See [tool usage guidelines](docs/tool-usage-guidelines.md) for writing effective tool instructions.
* **`description.md` (optional)**:  A concise overview of the recipe, incorporated into the generated `README.md` after the title and before the main `recipe.yaml` description. See [description guidelines](docs/description-guidelines.md) for formatting rules.

These files are **automatically generated**:

* **`README.md`**: **Auto-generated** from `recipe.yaml`, including the workflow diagram, parameters, tools, steps, and tips.  Content from `description.md` is included at the beginning.
* **`workflow.mmd`**: Contains the Mermaid code for the workflow diagram, **auto-generated** from `recipe.yaml`.

## Contributing

1. Fork the repository.
2. Create a new branch.
3. **Validate your recipe:**

   ```bash
   python .github/scripts/validate_yaml.py
   python .github/scripts/validate_schema.py schema/recipe-schema.json recipes/
   python .github/scripts/check_files.py
   ```

4. Add your recipe, following the structure above.
5. Fill in the pull request template.
6. Submit a pull request.

## Automation

* **Recipe Validation:**  YAML syntax and schema validation on push/PR.
* **Documentation Generation:** Generates `README.md` and `workflow.mmd` on push to `main`.
* **Pages Deployment:** Deploys the web app on push to `main`.

## License

MIT License - see `LICENSE`.
