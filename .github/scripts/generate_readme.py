#!/usr/bin/env python3
"""
Generate README.md files from recipe.yaml and description.md (if exists)
"""

import os
import sys
import yaml
from pathlib import Path

def generate_mermaid_diagram(workflow):
    """Generate Mermaid diagram from workflow steps."""
    mermaid = 'graph TD\n'
    
    # Add nodes and connections
    for i, step in enumerate(workflow):
        step_id = step['id']
        step_name = step['name']
        tool = step['tool']
        
        # Add node
        mermaid += f'    {step_id}["{step_name}<br>({tool})"]\n'
        
        # Add connection to next step
        if i < len(workflow) - 1:
            next_step = workflow[i + 1]
            mermaid += f'    {step_id} -->|{step.get("output_handling", "Output")}| {next_step["id"]}\n'
    
    return mermaid

def generate_parameters_table(parameters):
    """Generate markdown table for parameters."""
    table = '| Parameter | Required | Description | Example |\n'
    table += '|-----------|----------|-------------|----------|\n'
    
    for param in parameters:
        required = 'Yes' if param.get('required', False) else 'No'
        table += f'| {param["name"]} | {required} | {param["description"]} | {param["example"]} |\n'
    
    return table

def generate_tools_section(tools):
    """Generate tools section."""
    section = ''
    for tool_name, tool_info in tools.items():
        section += f'### {tool_name}\n\n'
        if 'used_for' in tool_info:
            for use in tool_info['used_for']:
                section += f'- {use}\n'
        if 'settings' in tool_info:
            section += '\n**Settings:**\n\n'
            for setting, value in tool_info['settings'].items():
                section += f'- {setting}: {value}\n'
        section += '\n'
    return section

def generate_readme(recipe_data, description=''):
    """Generate complete README content."""
    workflow_diagram = generate_mermaid_diagram(recipe_data['workflow'])
    parameters_table = generate_parameters_table(recipe_data['parameters'])
    tools_section = generate_tools_section(recipe_data['tools'])
    
    readme = f"""# {recipe_data['name']}

{description}

{recipe_data['description']}

## Workflow

```mermaid
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
    yaml_path = recipe_dir / 'recipe.yaml'
    description_path = recipe_dir / 'description.md'
    readme_path = recipe_dir / 'README.md'
    
    try:
        # Read recipe.yaml
        with open(yaml_path, 'r') as f:
            recipe_data = yaml.safe_load(f)
        
        # Read description.md if it exists
        description = ''
        if description_path.exists():
            with open(description_path, 'r') as f:
                description = f.read()
        
        # Generate README content
        readme_content = generate_readme(recipe_data, description)
        
        # Write README.md
        with open(readme_path, 'w') as f:
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