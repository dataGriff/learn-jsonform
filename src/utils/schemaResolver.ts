/**
 * Schema resolver utility to handle $ref resolution for JSON Forms
 * 
 * JSON Forms doesn't automatically resolve $ref when schemas are imported
 * as static JSON files. This utility resolves references manually.
 */

import personSchema from '../../schemas/person.schema.json';

/**
 * Resolves $ref references in a JSON Schema
 * Currently supports local file references to person.schema.json
 */
export function resolveSchemaReferences(schema: any): any {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  // Handle arrays
  if (Array.isArray(schema)) {
    return schema.map(item => resolveSchemaReferences(item));
  }

  // Handle $ref resolution
  if (schema.$ref) {
    if (schema.$ref === './person.schema.json') {
      // Return the resolved person schema but preserve other properties
      const resolved = { ...personSchema };
      
      // If there are other properties alongside $ref, merge them
      const { $ref, ...otherProps } = schema;
      return {
        ...resolved,
        ...otherProps
      };
    }
    // For other refs, return as-is (could be extended later)
    return schema;
  }

  // Recursively resolve references in nested objects
  const resolved: any = {};
  for (const [key, value] of Object.entries(schema)) {
    resolved[key] = resolveSchemaReferences(value);
  }

  return resolved;
}