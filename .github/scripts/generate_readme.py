#!/usr/bin/env python3
"""
Generate README.md files from recipe.yaml, workflow.mmd, and description.md
"""

import os
import sys
import yaml
import re
from pathlib import Path

def read_file_if_exists(path):
    """Read file content if it exists, return empty string otherwise."""
    try:
        with open(path, 'r') as f:
            return f.read()
    except FileNotFoundError:
        return ''

def process_step_references(text, workflow_steps, current_step_index):
    """Replace #step_id references with human-readable text."""
    if not text:
        return text
        
    step_map = {step['id']: (i, step['name']) for i, step in enumerate(workflow_steps)}
    
    def replace_reference(match):
        step_id = match.group(1)
        if step_id not in step_map:
            return f"#{step_id}"  # Keep original if step not found
            
        step_index, step_name = step_map[step_id]
        step_number = step_index + 1
        
        if step_index == current_step_index - 1:
            return f"the previous step ({step_number}. {step_name})"
        elif step_index == current_step_index + 1:
            return f"the next step ({step_number}. {step_name})"
        else:
            return f"step {step_number} ({step_name})"
            
    return re.sub(r'#([a-z0-9_-]+)', replace_reference, text)

def generate_readme(recipe_data, workflow_diagram, description=''):
    """Generate complete README content."""
    parameters_table = '| Parameter | Required | Description | Example |\n'
    parameters_table += '|-----------|----------|-------------|----------|\n'
    
    for param in recipe_data.get('parameters', []):
        required = 'Yes' if param.get('required', False) else 'No'
        parameters_table += f"| {param['name']} | {required} | {param['description']} | {param.get('example', '')} |\n"
    
    # Generate tools section
    tools_section = ''
    workflow_tools = set()
    for step in recipe_data.get('workflow', []):
        if isinstance(step.get('tool'), dict):
            tool_name = step['tool'].get('name')
        else:
            tool_name = step.get('tool')
        if tool_name:
            workflow_tools.add(tool_name)
    
    for tool_name in workflow_tools:
        tools_section += f'### {tool_name}\n\n'
        # Add any tool-specific information here if needed
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
    workflow_steps = recipe_data.get('workflow', [])
    for i, step in enumerate(workflow_steps):
        readme += f"### {i+1}. {step['name']}\n\n"
        
        # Process step references in description
        processed_description = process_step_references(step['description'], workflow_steps, i)
        readme += f"{processed_description}\n\n"
        
        if 'input_source' in step:
            processed_input = process_step_references(step['input_source'], workflow_steps, i)
            readme += f"**Input:** {processed_input}\n\n"
            
        if 'tool_usage' in step:
            processed_usage = process_step_references(step['tool_usage'], workflow_steps, i)
            readme += "**Usage:**\n"
            readme += f"{processed_usage}\n\n"
            
        if 'output_handling' in step:
            processed_output = process_step_references(step['output_handling'], workflow_steps, i)
            readme += f"**Output:** {processed_output}\n\n"
            
        if 'notes' in step:
            processed_notes = process_step_references(step['notes'], workflow_steps, i)
            readme += f"**Note:** {processed_notes}\n\n"
    
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
            for param, value in example.get('parameters', {}).items():
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
