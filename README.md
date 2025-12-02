# Learn JSON Forms

A learning exercise for [JSON Forms](https://jsonforms.io/) - a declarative framework for building web forms using JSON Schema and UI Schema.

## Overview

This project demonstrates how to use JSON Forms with React and Material UI to create dynamic forms. It includes two example forms:

- **🧀 Cheese Form**: Capture information about your favorite cheeses
- **🥃 Whiskey Form**: Record details about whiskeys you've tasted

## Features

- Declarative form definitions using JSON Schema
- Custom UI layouts using UI Schema
- Material UI styling
- Form data validation
- Real-time JSON data preview
- Tabbed interface for multiple forms

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [Task](https://taskfile.dev/) (optional, for using Taskfile commands)

## Getting Started

### Using Task (Recommended)

If you have [Task](https://taskfile.dev/) installed:

```bash
# Show available tasks
task

# Install dependencies
task install

# Start development server
task dev
```

### Using npm directly

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Tasks

| Task | Description |
|------|-------------|
| `task install` | Install project dependencies |
| `task dev` | Start development server |
| `task build` | Build the application for production |
| `task preview` | Preview the production build locally |
| `task lint` | Run ESLint to check code quality |
| `task lint:fix` | Run ESLint and automatically fix issues |
| `task typecheck` | Run TypeScript type checking |
| `task clean` | Remove build artifacts and node_modules |
| `task clean:build` | Remove build artifacts only |
| `task rebuild` | Clean build artifacts and rebuild |
| `task help` | Show help information about the project |

## Project Structure

```
learn-jsonform/
├── src/
│   ├── forms/
│   │   ├── cheese/
│   │   │   ├── schema.json      # JSON Schema for cheese form
│   │   │   ├── uischema.json    # UI Schema for cheese form layout
│   │   │   └── index.ts         # Exports for cheese form
│   │   ├── whiskey/
│   │   │   ├── schema.json      # JSON Schema for whiskey form
│   │   │   ├── uischema.json    # UI Schema for whiskey form layout
│   │   │   └── index.ts         # Exports for whiskey form
│   │   └── index.ts             # Main forms exports
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── Taskfile.yml                 # Task runner configuration
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## Understanding JSON Forms

### JSON Schema

The JSON Schema defines the data structure and validation rules for your form. Example from the cheese form:

```json
{
  "type": "object",
  "properties": {
    "cheeseName": {
      "type": "string",
      "title": "Cheese Name",
      "description": "Name of your favorite cheese"
    },
    "cheeseType": {
      "type": "string",
      "title": "Cheese Type",
      "enum": ["Soft", "Semi-soft", "Semi-hard", "Hard", "Blue"]
    }
  },
  "required": ["cheeseName", "cheeseType"]
}
```

### UI Schema

The UI Schema controls the layout and appearance of your form:

```json
{
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Group",
      "label": "Basic Information",
      "elements": [
        {
          "type": "Control",
          "scope": "#/properties/cheeseName"
        }
      ]
    }
  ]
}
```

## Technologies Used

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vite.dev/) - Build tool and development server
- [JSON Forms](https://jsonforms.io/) - Form rendering framework
- [Material UI](https://mui.com/) - React component library
- [Task](https://taskfile.dev/) - Task runner

## License

This project is for learning purposes.
