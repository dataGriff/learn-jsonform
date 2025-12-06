#!/bin/bash

# Install Task (Taskfile runner)
echo "Installing Task (Taskfile runner)..."

# Download and install Task
curl -sL https://taskfile.dev/install.sh | sh

# Move task to a directory in PATH
sudo mv ./bin/task /usr/local/bin/task

# Verify installation
echo "Task version:"
task --version

# Install additional tools that might be useful
echo "Installing additional development tools..."

# Make sure we have the latest package lists
sudo apt-get update

# Install useful tools for the development environment
sudo apt-get install -y \
    tree \
    jq \
    httpie \
    curl \
    wget

echo "Development tools installation completed!"
echo "Available commands:"
echo "  - task: Taskfile runner"
echo "  - tree: Directory structure display"
echo "  - jq: JSON processor"
echo "  - http: HTTPie for API testing"

# Verify Task installation by running task --list if Taskfile.yml exists
if [ -f "Taskfile.yml" ]; then
    echo "Available tasks:"
    task --list
fi