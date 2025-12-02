# Multi-Tenant Container Deployment

Your JSON Forms application now supports multi-tenant deployment using Docker containers. Each tenant can run their own customized form combinations without any code changes.

## Quick Start

### 1. Build the Docker image
```bash
task docker:build
```

> **Note**: The `docker:build` task automatically:
> - Runs `sync-public` to resolve schema `$ref` dependencies and copy files to `public/` folder
> - Inlines referenced schemas (e.g., `person.schema.json` into `whiskey.schema.json`) so they work in the browser
> - Copies UI definitions to ensure forms load correctly in the container

### 2. Run different tenant configurations

**Brewery Corporation** (whiskey + cheese forms):
```bash
docker run -d --name brewery \
  -p 3001:80 \
  -e TENANT_FORMS="whiskey,cheese" \
  -e TENANT_NAME="Brewery Corp" \
  -e TENANT_PRIMARY_COLOR="#8B4513" \
  jsonforms-app
```

**Healthcare Inc** (person + health forms):
```bash
docker run -d --name healthcare \
  -p 3002:80 \
  -e TENANT_FORMS="person,health" \
  -e TENANT_NAME="Healthcare Inc" \
  -e TENANT_PRIMARY_COLOR="#2E8B57" \
  jsonforms-app
```

### 3. Access your tenants
- Brewery Corp: http://localhost:3001
- Healthcare Inc: http://localhost:3002

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TENANT_FORMS` | Comma-separated list of forms to display | `whiskey,cheese` |
| `TENANT_NAME` | Company/organization name | `Default Company` |
| `TENANT_PRIMARY_COLOR` | Primary theme color (hex) | `#1976d2` |
| `TENANT_SECONDARY_COLOR` | Secondary theme color (hex) | `#dc004e` |

## Available Forms

- `whiskey` - Whiskey preference form
- `cheese` - Cheese preference form  
- `person` - Personal information form
- `health` - Health information form

## Demo Script

Run the included demo script to start 4 different tenant configurations:
```bash
./demo-tenants.sh
```

This will create:
- **Brewery Corp**: whiskey + cheese (port 3001)
- **Healthcare Inc**: person + health (port 3002)  
- **Gourmet Foods Ltd**: cheese only (port 3003)
- **Executive Consulting**: person + whiskey (port 3004)

## Architecture Benefits

✅ **Single Docker Image** - Build once, configure per deployment  
✅ **Zero Code Changes** - Pure environment-driven configuration  
✅ **Complete Isolation** - Each tenant runs in separate container  
✅ **Shared Schema Architecture** - Consistent data models across all tenants  
✅ **Runtime Configuration** - No rebuild needed for new tenant combinations

## Troubleshooting

### Forms Don't Render

If you see "Loading forms..." or forms don't appear:

1. **Clear browser cache** - The most common issue
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private browsing mode
   
2. **Check browser console** (F12) for errors
   - Look for schema loading errors
   - Verify schemas are being fetched successfully

3. **Verify schemas are resolved**
   ```bash
   curl http://localhost:3001/schemas/whiskey.schema.json | jq '.properties.reviewer.type'
   # Should return: "object" (not a $ref)
   ```