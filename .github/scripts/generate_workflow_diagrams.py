#!/usr/bin/env python3
"""
Generate workflow.mmd files from recipe.yaml files
"""

import os
import sys
import yaml
from pathlib import Path

def generate_workflow_diagram(workflow):
    """Generate Mermaid diagram content from workflow steps."""
    mermaid = ''
    
    # Add Mermaid directive and title
    mermaid += 'graph TD\n'
    
    # Add nodes and connections
    for i, step in enumerate(workflow):
        step_id = step['id']
        step_name = step['name']
        tool = step['tool']
        
        # Add node with tool info
        mermaid += f'    {step_id}["{step_name}<br>({tool})"]\n'
        
        # Add connection to next step if not last step
        if i < len(workflow) - 1:
            next_step = workflow[i + 1]
            output = step.get('output_handling', 'Output')
            mermaid += f'    {step_id} -->|{output}| {next_step["id"]}\n'
    
    return mermaid

def process_recipe_dir(recipe_dir):
    """Process a single recipe directory."""
    try:
        # Read recipe.yaml
        yaml_path = recipe_dir / 'recipe.yaml'
        with open(yaml_path, 'r') as f:
            recipe_data = yaml.safe_load(f)
        
        # Generate workflow diagram
        workflow_diagram = generate_workflow_diagram(recipe_data['workflow'])
        
        # Write workflow.mmd
        with open(recipe_dir / 'workflow.mmd', 'w') as f:
            f.write(workflow_diagram)
            
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
        print("Workflow diagram generation failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)
    
    print("Workflow diagram generation completed successfully")
    sys.exit(0)

if __name__ == "__main__":
    main()
