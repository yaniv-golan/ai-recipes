#!/bin/bash

# sync-tools.sh
#
# Description:
#   Synchronizes tool configurations and schemas for the AI Recipes project.
#   This script handles the file synchronization part of the process, while
#   git operations are handled separately by the CI/CD workflow.
#
# Usage:
#   ./scripts/sync-tools.sh
#
# Dependencies:
#   - bash 4.0+ (for error handling)
#
# Exit codes:
#   0 - Success
#   1 - Directory creation failed
#   2 - File copy failed

set -euo pipefail  # Exit on error, undefined vars, and pipe failures

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to create directory if it doesn't exist
create_dir() {
    local dir="$1"
    if ! mkdir -p "$dir"; then
        log_error "Failed to create directory: $dir"
        exit 1
    fi
}

# Function to copy files with error handling
copy_files() {
    local src="$1"
    local dest="$2"
    if ! cp -r "$src" "$dest"; then
        log_error "Failed to copy from $src to $dest"
        exit 2
    fi
}

# Main script
main() {
    log_info "Starting tool synchronization..."

    # Create target directories
    log_info "Creating target directories..."
    create_dir "web/public/data/tools"
    create_dir "web/public/data/schemas"

    # Copy tool configurations
    log_info "Copying tool configurations..."
    copy_files "tools/"* "web/public/data/tools/"

    # Copy tool schemas
    log_info "Copying tool schemas..."
    copy_files "schema/tool-schema.json" "web/public/data/schemas/"
    copy_files "schema/tools/"*.json "web/public/data/schemas/"

    log_info "Tool synchronization completed successfully!"
    log_info "Note: Git operations are handled by the CI/CD workflow"
}

# Run main function
main 