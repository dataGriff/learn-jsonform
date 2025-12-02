#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const schemasDir = path.join(__dirname, '..', 'schemas');
const publicSchemasDir = path.join(__dirname, '..', 'public', 'schemas');

// Read all schemas
const schemas = {};
const schemaFiles = fs.readdirSync(schemasDir).filter(f => f.endsWith('.schema.json'));

for (const file of schemaFiles) {
  const schemaPath = path.join(schemasDir, file);
  schemas[file] = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
}

// Resolve $ref in a schema object
function resolveRefs(obj, schemas) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => resolveRefs(item, schemas));
  }

  const resolved = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$ref' && typeof value === 'string' && value.startsWith('./')) {
      // This is a relative reference - inline it
      const refFile = value.substring(2); // Remove './'
      const refSchema = schemas[refFile];
      
      if (!refSchema) {
        console.error(`Warning: Referenced schema ${refFile} not found`);
        resolved[key] = value;
        continue;
      }
      
      // Inline the referenced schema (excluding $schema)
      const { $schema, ...refContent } = refSchema;
      
      // Merge ref content first, then any sibling properties will override
      Object.assign(resolved, resolveRefs(refContent, schemas));
      
      // Don't add $ref to resolved - it's been inlined
      continue;
    } else if (key === 'title' || key === 'description') {
      // Handle title/description that appear alongside $ref
      // These should override the referenced schema's title/description
      resolved[key] = value;
    } else {
      resolved[key] = resolveRefs(value, schemas);
    }
  }
  
  return resolved;
}

// Process each schema
for (const [file, schema] of Object.entries(schemas)) {
  const resolved = resolveRefs(schema, schemas);
  
  // Write to public/schemas
  fs.mkdirSync(publicSchemasDir, { recursive: true });
  const outputPath = path.join(publicSchemasDir, file);
  fs.writeFileSync(outputPath, JSON.stringify(resolved, null, 2));
  
  console.log(`✓ Resolved ${file}`);
}

console.log('\nAll schemas resolved and written to public/schemas/');
