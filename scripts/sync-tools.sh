#!/bin/bash

# sync-tools.sh
#
# Description:
#   Synchronizes tool configurations and schemas for the AI Recipes project.
#   This script mirrors the functionality of the GitHub Actions workflow
#   defined in .github/workflows/sync-tools.yml
#
# Usage:
#   ./scripts/sync-tools.sh
#
# Dependencies:
#   - git (for committing changes)
#   - bash 4.0+ (for error handling)
#
# Exit codes:
#   0 - Success
#   1 - Directory creation failed
#   2 - File copy failed
#   3 - Git operations failed

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

# Function to check if a command exists
check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "$1 is required but not installed."
        exit 1
    fi
}

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

    # Check for required commands
    check_command "git"

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

    # Stage changes in git
    log_info "Staging changes..."
    if ! git add web/public/data/tools web/public/data/schemas; then
        log_error "Failed to stage changes in git"
        exit 3
    fi

    # Check if there are changes to commit
    if git diff --cached --quiet; then
        log_warn "No changes to commit"
    else
        # Commit changes
        log_info "Committing changes..."
        if ! git commit -m "Sync tool configurations and schemas"; then
            log_error "Failed to commit changes"
            exit 3
        fi

        log_info "Changes committed successfully"
        log_info "Run 'git push' to sync changes with remote repository"
    fi

    log_info "Tool synchronization completed successfully!"
}

# Run main function
main 