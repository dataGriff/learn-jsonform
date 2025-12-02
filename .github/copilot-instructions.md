# Copilot Instructions

## Project Overview
This is a JSON Forms learning project that demonstrates declarative form building using shared JSON Schema and UI Schema patterns. The app renders two example forms (cheese and whiskey) in a Material UI tabbed interface with real-time JSON preview. Uses shared schema architecture for perfect form/API synchronization.

## Architecture Pattern
- **Shared Schemas**: Single source of truth in `/schemas/` directory - no duplication between forms and API
- **Schema References**: Schemas can use `$ref: "./other.schema.json"` for reusable components (e.g., person details)
- **Schema Resolution**: `bin/resolve-schema-refs.cjs` inlines `$ref` dependencies for browser compatibility
- **UI Definitions**: Separate UI schemas in `/ui/` directory define layout without mixing data concerns
- **Form Integration**: Forms load dynamically via `FormRegistry` from `/schemas/` and `/ui/` endpoints
- **API Integration**: OpenAPI spec directly references shared schemas via `./schemas/{name}.schema.json`
- **State Management**: Simple React state for form data, no external state management
- **Component Structure**: Single `App.tsx` with tabbed interface, form data displayed as JSON preview

## Development Workflow
- **Task Runner**: Use Task commands (`task dev`, `task build`) - preferred over npm scripts
- **Dev Server**: Vite development server on port 5173
- **Form Testing**: Real-time JSON preview shows form data changes immediately
- **Linting**: ESLint with React-specific rules (`task lint` or `task lint:fix`)
- **Architecture Validation**: `task validate-schemas` ensures shared schema architecture integrity
- **Docker Builds**: `task sync-public` resolves schema refs before building - always run before `docker build`

## Adding New Forms
1. Create schema: `schemas/{form-name}.schema.json` (data structure/validation)
2. Create UI definition: `ui/{form-name}.jsonforms.json` (layout using Groups, HorizontalLayout, VerticalLayout)
3. Create form integration: `src/forms/{form-name}/index.ts` importing from shared schemas
4. Update `src/forms/index.ts` with new exports
5. Add tab and TabPanel in `App.tsx` following existing pattern
6. Update OpenAPI spec to reference new shared schema if needed

## JSON Forms Patterns
- **Layout Controls**: Use `Group` for sections, `HorizontalLayout` for side-by-side fields
- **Field References**: UI Schema uses `"scope": "#/properties/fieldName"` to reference schema properties
- **Validation**: Define in shared JSON Schema with `required`, `minimum`, `maximum`, `enum` properties
- **Material Renderers**: Always use `materialRenderers` and `materialCells` for consistent styling

## Key Dependencies
- `@jsonforms/react` - Core form rendering
- `@jsonforms/material-renderers` - Material UI renderers
- `@mui/material` - UI components and theming
- Form data flows: JsonForms component → onChange callback → React state → JSON preview

## Shared Schema Benefits
- **Single Source of Truth**: No schema duplication between forms and API
- **Automatic Sync**: Forms and API always use identical data structures
- **Easy Maintenance**: Update schema once, changes apply everywhere
- **Zero Drift**: Architecture validation prevents inconsistencies

## Common Patterns
- Form state: `const [formData, setFormData] = useState({})`
- JsonForms props: `schema`, `uischema`, `data`, `renderers`, `cells`, `onChange`
- Submit handling: Console logging with alert confirmation
- Theme: Material UI light theme with custom primary colors