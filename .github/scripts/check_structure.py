#!/usr/bin/env python3
"""
Check recipe directory structure follows the expected pattern:
recipes/
  username/
    recipe-name/
      recipe.yaml
      README.md
"""

import os
import sys
from pathlib import Path

def check_recipe_structure(recipe_dir):
    errors = []
    
    # Check if recipes dir exists
    if not recipe_dir.exists():
        errors.append(f"Missing recipes directory: {recipe_dir}")
        return errors
        
    # Check each user directory
    for user_dir in recipe_dir.iterdir():
        if not user_dir.is_dir():
            continue
            
        # Check each recipe directory
        for recipe_dir in user_dir.iterdir():
            if not recipe_dir.is_dir():
                continue
                
            # Check recipe.yaml exists
            recipe_yaml = recipe_dir / "recipe.yaml"
            if not recipe_yaml.exists():
                errors.append(f"Missing recipe.yaml in {recipe_dir}")
                
            # Check README.md exists
            readme = recipe_dir / "README.md"
            if not readme.exists():
                errors.append(f"Missing README.md in {recipe_dir}")
                
    return errors

def main():
    recipe_dir = Path("recipes")
    errors = check_recipe_structure(recipe_dir)
    
    if errors:
        print("Directory structure validation failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)
        
    print("Directory structure validation passed")
    sys.exit(0)

if __name__ == "__main__":
    main()