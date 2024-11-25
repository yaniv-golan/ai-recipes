#!/usr/bin/env python3
"""
Generate README.md files from recipe.yaml, workflow.mmd, and description.md
"""

import os
import sys
import yaml
from pathlib import Path

def read_file_if_exists(path):
    """Read file content if it exists, return empty string otherwise."""
    try:
        with open(path, 'r') as f:
            return f.read()
    except FileNotFoundError:
        return ''

def generate_readme(recipe_data, workflow_diagram, description=''):
    """Generate complete README content."""
    parameters_table = '| Parameter | Required | Description | Example |\n'
    parameters_table += '|-----------|----------|-------------|----------|\n'
    
    for param in recipe_data['parameters']:
        required = 'Yes' if param.get('required', False) else 'No'
        parameters_table += f"| {param['name']} | {required} | {param['description']} | {param['example']} |\n"
    
    # Generate tools section
    tools_section = ''
    for tool_name, tool_info in recipe_data['tools'].items():
        tools_section += f'### {tool_name}\n\n'
        if 'used_for' in tool_info:
            for use in tool_info['used_for']:
                tools_section += f'- {use}\n'
        if 'settings' in tool_info:
            tools_section += '\n**Settings:**\n\n'
            for setting, value in tool_info['settings'].items():
                tools_section += f'- {setting}: {value}\n'
        tools_section += '\n'
    
    readme = f"""# {recipe_data['name']}

{description}

{recipe_data['description']}

## Workflow

```mermaid
---
title: Workflow
---
{workflow_diagram}
```

## Parameters

{parameters_table}

## Tools Required

{tools_section}

## Workflow Steps
"""
    
    # Add workflow steps
    for step in recipe_data['workflow']:
        readme += f"### {step['name']}\n\n"
        readme += f"{step['description']}\n\n"
        if 'tool_usage' in step:
            readme += "**Usage:**\n"
            readme += f"{step['tool_usage']}\n\n"
        if 'notes' in step:
            readme += f"**Note:** {step['notes']}\n\n"
    
    # Add tips if present
    if 'tips' in recipe_data:
        readme += "## Tips\n\n"
        for tip in recipe_data['tips']:
            readme += f"- {tip}\n"
        readme += "\n"
    
    # Add examples if present
    if 'examples' in recipe_data:
        readme += "## Examples\n\n"
        for example in recipe_data['examples']:
            readme += "### Example Usage\n\n"
            readme += "Parameters:\n```yaml\n"
            for param, value in example['parameters'].items():
                readme += f"{param}: {value}\n"
            readme += "```\n\n"
            if 'sample_queries' in example:
                readme += "Sample Queries:\n"
                for query in example['sample_queries']:
                    readme += f"- {query}\n"
            readme += "\n"
    
    return readme

def process_recipe_dir(recipe_dir):
    """Process a single recipe directory."""
    try:
        # Read required files
        with open(recipe_dir / 'recipe.yaml', 'r') as f:
            recipe_data = yaml.safe_load(f)
            
        # Read workflow.mmd
        workflow_diagram = read_file_if_exists(recipe_dir / 'workflow.mmd')
        
        # Read description.md if it exists
        description = read_file_if_exists(recipe_dir / 'description.md')
        
        # Generate README content
        readme_content = generate_readme(recipe_data, workflow_diagram, description)
        
        # Write README.md
        with open(recipe_dir / 'README.md', 'w') as f:
            f.write(readme_content)
            
        return None
    except Exception as e:
        return f"Error processing {recipe_dir}: {str(e)}"

def main():
    recipes_dir = Path("recipes")
    errors = []
    
    for user_dir in recipes_dir.iterdir():
        if not user_dir.is_dir():
            continue
            
        for recipe_dir in user_dir.iterdir():
            if not recipe_dir.is_dir():
                continue
                
            error = process_recipe_dir(recipe_dir)
            if error:
                errors.append(error)
    
    if errors:
        print("README generation failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)
    
    print("README generation completed successfully")
    sys.exit(0)

if __name__ == "__main__":
    main()
