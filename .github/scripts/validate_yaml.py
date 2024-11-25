#!/usr/bin/env python3
"""
Validate YAML syntax for all recipe files
"""

import os
import sys
import yaml
from pathlib import Path

def validate_yaml_file(file_path):
    try:
        with open(file_path, 'r') as f:
            yaml.safe_load(f)
        return None
    except yaml.YAMLError as e:
        return f"YAML syntax error in {file_path}: {str(e)}"

def validate_yaml_files(recipes_dir):
    errors = []
    
    # Find all .yaml and .yml files
    yaml_files = []
    for ext in ['.yaml', '.yml']:
        yaml_files.extend(Path(recipes_dir).rglob(f"*{ext}"))
    
    # Validate each file
    for yaml_file in yaml_files:
        error = validate_yaml_file(yaml_file)
        if error:
            errors.append(error)
            
    return errors

def main():
    errors = validate_yaml_files("recipes")
    
    if errors:
        print("YAML validation failed:")
        for error in errors:
            print(f"- {error}")
        sys.exit(1)
        
    print("YAML validation passed")
    sys.exit(0)

if __name__ == "__main__":
    main()