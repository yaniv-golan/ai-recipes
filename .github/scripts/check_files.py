#!/usr/bin/env python3
"""
Check for required files in recipe directories:
- recipe.yaml (required)
- description.md (optional)
- README.md (will be generated)
- workflow.mmd (will be generated)
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
    warnings = []
    
    # Check recipe directory name
    if not is_url_friendly(recipe_dir.name):
        errors.append(f"Recipe directory name not URL-friendly: {recipe_dir.name}")
    
    # Check required files
    recipe_yaml = recipe_dir / 'recipe.yaml'
    if not recipe_yaml.exists():
        errors.append(f"Missing recipe.yaml in {recipe_dir}")
    else:
        try:
            with open(recipe_yaml, 'r') as f:
                recipe = yaml.safe_load(f)
                
                # Check tags are URL-friendly
                if 'tags' in recipe:
                    for tag in recipe['tags']:
                        if not is_url_friendly(tag):
                            errors.append(f"Tag not URL-friendly in {recipe_yaml}: {tag}")
                
        except yaml.YAMLError:
            # YAML syntax errors are caught by validate_yaml.py
            pass
        except Exception as e:
            errors.append(f"Error processing {recipe_yaml}: {str(e)}")
            
    return errors, warnings

def check_all_recipes():
    all_errors = []
    all_warnings = []
    recipes_dir = Path("recipes")
    
    if not recipes_dir.exists():
        all_errors.append("recipes directory not found")
        return all_errors, all_warnings
    
    # Check each user directory
    for user_dir in recipes_dir.iterdir():
        if not user_dir.is_dir():
            continue
            
        # Check user directory name
        if not is_url_friendly(user_dir.name):
            all_errors.append(f"User directory name not URL-friendly: {user_dir.name}")
            continue  # Skip checking recipes in invalid user directories
            
        # Check each recipe directory
        for recipe_dir in user_dir.iterdir():
            if not recipe_dir.is_dir():
                continue
            errors, warnings = check_recipe_files(recipe_dir)
            all_errors.extend(errors)
            all_warnings.extend(warnings)
            
    return all_errors, all_warnings

def main():
    errors, warnings = check_all_recipes()
    
    # Always show warnings
    if warnings:
        print("\nWarnings:")
        for warning in warnings:
            print(f"- {warning}")
    
    # Exit with error if there are actual errors
    if errors:
        print("\nErrors:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)
        
    if not warnings:
        print("All checks passed")
    sys.exit(0)

if __name__ == "__main__":
    main()
