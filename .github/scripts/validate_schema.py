#!/usr/bin/env python3
"""
Validate recipes against schema
"""

import os
import sys
import yaml
import yamale
from pathlib import Path

def validate_recipe(schema_path, recipe_path):
    try:
        schema = yamale.make_schema(schema_path)
        data = yamale.make_data(recipe_path)
        yamale.validate(schema, data)
        return None
    except ValueError as e:
        return f"Schema validation failed for {recipe_path}: {str(e)}"

def validate_recipes(schema_path):
    errors = []
    recipes_dir = Path("recipes")
    
    # Find all recipe.yaml files
    recipe_files = recipes_dir.rglob("recipe.yaml")
    
    # Validate each recipe
    for recipe_file in recipe_files:
        error = validate_recipe(schema_path, recipe_file)
        if error:
            errors.append(error)
            
    return errors

def main():
    schema_path = "schema/recipe-schema.yml"
    if not Path(schema_path).exists():
        print(f"Schema file not found: {schema_path}")
        sys.exit(1)
        
    errors = validate_recipes(schema_path)
    
    if errors:
        print("Schema validation failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)
        
    print("Schema validation passed")
    sys.exit(0)

if __name__ == "__main__":
    main()