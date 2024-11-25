#!/usr/bin/env python3
"""
Check for required files in recipe directories:
- recipe.yaml
- workflow.mmd
- description.md (optional)
- README.md (will be generated)
Also validates URL-friendly names
"""

import os
import sys
import re
import yaml
from pathlib import Path

def is_url_friendly(name):
    return bool(re.match(r'^[a-z0-9-]+$', name))

def check_recipe_files(recipe_dir):
    errors = []
    
    # Check recipe directory name
    if not is_url_friendly(recipe_dir.name):
        errors.append(f"Recipe directory name not URL-friendly: {recipe_dir.name}")
    
    # Check required files
    required_files = ['recipe.yaml', 'workflow.mmd']
    for required_file in required_files:
        file_path = recipe_dir / required_file
        if not file_path.exists():
            errors.append(f"Missing {required_file} in {recipe_dir}")
            
    # If recipe.yaml exists, check tags are URL-friendly
    recipe_yaml = recipe_dir / 'recipe.yaml'
    if recipe_yaml.exists():
        try:
            with open(recipe_yaml, 'r') as f:
                recipe = yaml.safe_load(f)
                if 'tags' in recipe:
                    for tag in recipe['tags']:
                        if not is_url_friendly(tag):
                            errors.append(f"Tag not URL-friendly in {recipe_yaml}: {tag}")
        except:
            # YAML syntax errors are caught by validate_yaml.py
            pass
            
    return errors

def check_all_recipes():
    errors = []
    recipes_dir = Path("recipes")
    
    # Check each user directory
    for user_dir in recipes_dir.iterdir():
        if not user_dir.is_dir():
            continue
            
        # Check user directory name
        if not is_url_friendly(user_dir.name):
            errors.append(f"User directory name not URL-friendly: {user_dir.name}")
            
        # Check each recipe directory
        for recipe_dir in user_dir.iterdir():
            if not recipe_dir.is_dir():
                continue
            errors.extend(check_recipe_files(recipe_dir))
            
    return errors

def main():
    errors = check_all_recipes()
    
    if errors:
        print("Required files check failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)
        
    print("Required files check passed")
    sys.exit(0)

if __name__ == "__main__":
    main()
