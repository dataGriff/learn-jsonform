# API Specification

This directory contains the OpenAPI specification that directly references the shared JSON schemas used throughout the project.

## Overview

The `openapi.yaml` file defines a RESTful API that uses the **same shared schemas** as the JSON Forms, ensuring perfect synchronization. This architecture provides:

- **Single source of truth**: Schemas defined once in `/schemas/` directory
- **Automatic consistency**: No manual synchronization needed between forms and API
- **Zero duplication**: Same schema files referenced by both JSON Forms and OpenAPI
- **Simplified maintenance**: Update schema once, changes apply everywhere

## Architecture

### Shared Schema References

The OpenAPI specification uses direct file references to shared schemas:

```yaml
# Input schemas directly reference shared files
requestBody:
  content:
    application/json:
      schema:
        $ref: './schemas/cheese.schema.json'

# Output schemas extend shared schemas with metadata
Cheese:
  allOf:
    - $ref: './schemas/cheese.schema.json'
    - type: object
      properties:
        id: { type: string, format: uuid }
        createdAt: { type: string, format: date-time }
        updatedAt: { type: string, format: date-time }
```

## Files

- `openapi.yaml` - OpenAPI 3.0.3 specification with shared schema references
- `validate-schemas.js` - Architecture validation (ensures proper file structure)
- `README.md` - This file

## Schema Validation

The validation script now focuses on **architecture validation** rather than schema comparison:

```bash
task validate-schemas
```

This validates:
- ✅ Shared schema files exist and are valid JSON
- ✅ UI schema files exist and are valid
- ✅ OpenAPI correctly references shared schemas
- ✅ Form imports point to shared schemas
- ✅ No schema duplication exists

## API Endpoints

### Cheese Resources
- `GET /cheeses` - List all cheeses (with pagination)
- `POST /cheeses` - Create a new cheese
- `GET /cheeses/{id}` - Get specific cheese
- `PUT /cheeses/{id}` - Update specific cheese
- `DELETE /cheeses/{id}` - Delete specific cheese

### Whiskey Resources
- `GET /whiskeys` - List all whiskeys (with pagination)
- `POST /whiskeys` - Create a new whiskey
- `GET /whiskeys/{id}` - Get specific whiskey
- `PUT /whiskeys/{id}` - Update specific whiskey
- `DELETE /whiskeys/{id}` - Delete specific whiskey

## Schema Consistency

The OpenAPI schemas are designed to be compatible with the JSON Forms schemas:

- **Input schemas** (`CheeseInput`, `WhiskeyInput`) match JSON Forms exactly
- **Output schemas** (`Cheese`, `Whiskey`) extend inputs with metadata (id, timestamps)
- **Validation rules** (required fields, enums, ranges) are preserved
- **Field descriptions** are carried over for documentation

## Usage Examples

### View API Documentation
Use any OpenAPI viewer like Swagger UI, Redoc, or VS Code extensions:

```bash
# Using swagger-ui-serve (install globally)
npm install -g swagger-ui-serve
swagger-ui-serve api/openapi.yaml

# Using redoc-cli (install globally)  
npm install -g redoc-cli
redoc-cli serve api/openapi.yaml
```

### Generate Code
Use OpenAPI generators to create client SDKs or server stubs:

```bash
# Generate TypeScript client
npx @openapitools/openapi-generator-cli generate \
  -i api/openapi.yaml \
  -g typescript-axios \
  -o generated/client

# Generate Node.js Express server stub
npx @openapitools/openapi-generator-cli generate \
  -i api/openapi.yaml \
  -g nodejs-express-server \
  -o generated/server
```

### Validate Schema Consistency
Run the validation script to ensure JSON Forms and API schemas stay aligned:

```bash
node api/validate-schemas.js
```

## Development Workflow

1. **Modify JSON Forms schema** (`src/forms/{form}/schema.json`)
2. **Update OpenAPI spec** (`api/openapi.yaml`) to match
3. **Run validation** to ensure consistency
4. **Regenerate clients/docs** if needed

## Integration with JSON Forms

The API is designed to work seamlessly with your JSON Forms:

```typescript
// Form data from JSON Forms can be POSTed directly to API
const formData = { 
  cheeseName: "Brie", 
  cheeseType: "Soft",
  // ... other fields
};

// POST to /cheeses
const response = await fetch('/api/v1/cheeses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});

// Response includes the same data plus metadata
const savedCheese = await response.json();
// { id: "uuid", createdAt: "2023-...", ...formData }
```

## Future Enhancements

Consider these additions as the project grows:

- **Filtering/Searching**: Query parameters for filtering by cheese type, origin, etc.
- **Bulk Operations**: Batch create/update/delete endpoints
- **Export Formats**: JSON, CSV, PDF export endpoints
- **File Uploads**: Image upload for cheese/whiskey photos
- **Authentication**: User-specific data with JWT tokens
- **Webhooks**: Event notifications when data changes