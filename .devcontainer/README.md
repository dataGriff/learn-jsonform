# Dev Container Configuration

This directory contains the development container configuration for the JSON Forms learning project.

## What's Included

### Base Image
- `mcr.microsoft.com/devcontainers/typescript-node:1-20-bullseye` - TypeScript/Node.js development environment

### Features
- **Docker-in-Docker**: For building and running containers within the dev container
- **Git**: Version control tools
- **GitHub CLI**: Command-line interface for GitHub

### Tools Installed
- **Task (Taskfile runner)**: Version 3.45.5+ - Essential for running project tasks
- **Tree**: Directory structure visualization
- **jq**: JSON processor for API testing and data manipulation
- **HTTPie**: Command-line HTTP client for API testing
- **curl/wget**: HTTP utilities (already included in base image)

### VS Code Extensions
- TypeScript language support
- Prettier code formatting
- ESLint linting
- Tailwind CSS support
- JSON support
- GitHub Copilot

### Port Forwarding
- **5173**: Vite development server
- **3000**: Production server
- **3001**: Multi-tenant demo server

## Usage

### Automatic Setup
When the dev container is created or rebuilt, the following happens automatically:
1. Base image is pulled and container is created
2. Features are installed (Docker, Git, GitHub CLI)
3. `install-tools.sh` script runs to install Task and additional tools
4. VS Code extensions are installed
5. `npm install` runs to install project dependencies

### Manual Task Installation
If you need to install Task manually in an existing container:
```bash
bash .devcontainer/install-tools.sh
```

### Available Commands
After setup, you'll have access to:
```bash
task --list          # Show available project tasks
task dev             # Start development server
task build           # Build for production
task lint            # Run code linting
task validate-schemas # Validate schema consistency
tree                 # Show directory structure
jq                   # Process JSON data
http                 # Make HTTP requests
```

## Rebuilding the Container

If you make changes to the dev container configuration:

1. **Command Palette** → `Dev Containers: Rebuild Container`
2. Or use **Command Palette** → `Dev Containers: Rebuild and Reopen in Container`

## Troubleshooting

### Task Not Found
If `task` command is not available:
1. Run `bash .devcontainer/install-tools.sh`
2. Restart your terminal session
3. Check installation with `which task`

### Port Conflicts
If development server ports are in use:
- Check running processes: `lsof -i :5173`
- Kill conflicting processes or use different ports
- Update port forwarding in `devcontainer.json` if needed

### VS Code Extensions
If extensions aren't loading:
1. Check the Extensions panel in VS Code
2. Manually install missing extensions
3. Rebuild the container if issues persist