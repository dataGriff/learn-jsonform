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
- **OpenAPI specification** aligned with form schemas for API development

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
├── schemas/                     # Shared JSON Schemas (single source of truth)
│   ├── cheese.schema.json       # Cheese data schema
│   └── whiskey.schema.json      # Whiskey data schema
├── ui/                          # JSON Forms UI definitions
│   ├── cheese.jsonforms.json    # Cheese form layout
│   └── whiskey.jsonforms.json   # Whiskey form layout
├── api/
│   ├── openapi.yaml            # API specification (references shared schemas)
│   ├── validate-schemas.js     # Architecture validation script
│   └── README.md               # API documentation
├── src/
│   ├── forms/
│   │   ├── cheese/
│   │   │   └── index.ts         # Exports (imports from shared schemas)
│   │   ├── whiskey/
│   │   │   └── index.ts         # Exports (imports from shared schemas)
│   │   └── index.ts             # Main forms exports
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── Taskfile.yml                 # Task runner configuration
├── package.json                 # Project dependencies
└── README.md                    # This file
```

## Understanding JSON Forms

### Shared Schema Architecture

This project uses a **single source of truth** approach for schemas:

- **Data Schemas** (`schemas/*.schema.json`): Define data structure and validation rules
- **UI Schemas** (`ui/*.jsonforms.json`): Define form layout and presentation
- **OpenAPI Integration**: API specification references the same shared schemas

### JSON Schema (Data Definition)

The shared JSON Schema defines the data structure and validation rules. Example from `schemas/cheese.schema.json`:

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

### UI Schema (Layout Definition)

The UI Schema controls the layout and appearance. Example from `ui/cheese.jsonforms.json`:

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

### Benefits of Shared Architecture

- **No Duplication**: Single schema definition used everywhere
- **Automatic Sync**: Forms and API always use identical data structures  
- **Easy Maintenance**: Update schema once, changes apply everywhere
- **Type Safety**: Consistent validation across all channels

## API Integration

This project includes an OpenAPI specification (`api/openapi.yaml`) that aligns with the JSON Forms schemas, enabling:

- **Multi-channel access**: Use the same data structures in forms and APIs
- **Code generation**: Generate client SDKs and server stubs
- **Documentation**: Interactive API documentation
- **Schema validation**: Ensure forms and API stay in sync

### API Validation

Validate that your JSON Forms schemas are consistent with the OpenAPI specification:

```bash
task validate-schemas
```

See `api/README.md` for detailed API documentation and usage examples.

## Technologies Used

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vite.dev/) - Build tool and development server
- [JSON Forms](https://jsonforms.io/) - Form rendering framework
- [Material UI](https://mui.com/) - React component library
- [Task](https://taskfile.dev/) - Task runner

## License

This project is for learning purposes.
