#!/bin/bash

rootDirectory="$(pwd)"

echo "Root directory: $rootDirectory"
echo "Searching and deleting node_modules and subdirectory .git folders..."

# Delete all node_modules
find "$rootDirectory" -type d -name "node_modules" -prune -exec rm -rf {} +

# Delete .git only in subdirectories (exclude root .git)
find "$rootDirectory" -type d -name ".git" -prune ! -path "$rootDirectory/.git" -exec rm -rf {} +

echo "Cleanup completed."
