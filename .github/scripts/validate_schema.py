#!/usr/bin/env python3
"""
Validate recipes against JSON Schema
"""

import os
import sys
import json
import yaml
from pathlib import Path
from jsonschema import validate, ValidationError, SchemaError

def load_json(file_path):
    """Load JSON file."""
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON schema file '{file_path}': {e}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"Schema file not found: {file_path}")
        sys.exit(1)

def load_yaml(file_path):
    """Load YAML file."""
    try:
        with open(file_path, 'r') as f:
            return yaml.safe_load(f)
    except yaml.YAMLError as e:
        return f"YAML syntax error in {file_path}: {e}"
    except FileNotFoundError:
        return f"Recipe file not found: {file_path}"

def validate_recipe(schema, recipe, recipe_path):
    """Validate a single recipe against the schema."""
    if isinstance(recipe, str):
        # An error message was returned
        return recipe
    try:
        validate(instance=recipe, schema=schema)
        return None
    except ValidationError as ve:
        return f"Validation error in '{recipe_path}': {ve.message} (at {'/'.join(map(str, ve.path))})"
    except SchemaError as se:
        return f"Schema error in '{schema_path}': {se.message}"

def validate_recipes(schema_path, recipes_dir):
    """Validate all recipes in the specified directory against the schema."""
    errors = []
    schema = load_json(schema_path)

    # Find all recipe.yaml or recipe.yml files
    recipe_files = list(Path(recipes_dir).rglob("recipe.yaml")) + list(Path(recipes_dir).rglob("recipe.yml"))

    if not recipe_files:
        print(f"No recipe files found in directory: {recipes_dir}")
        return ["No recipe files found."]

    for recipe_file in recipe_files:
        recipe = load_yaml(recipe_file)
        error = validate_recipe(schema, recipe, recipe_file)
        if error:
            errors.append(error)

    return errors

def main():
    if len(sys.argv) != 3:
        print("Usage: python validate_schema.py <schema_path.json> <recipes_directory>")
        sys.exit(1)

    schema_path = sys.argv[1]
    recipes_dir = sys.argv[2]

    errors = validate_recipes(schema_path, recipes_dir)

    if errors:
        print("Schema validation failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)

    print("Schema validation passed")
    sys.exit(0)

if __name__ == "__main__":
    main()
