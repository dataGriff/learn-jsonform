#!/usr/bin/env node

/**
 * Person Schema Synchronization Utility (DEPRECATED)
 * 
 * NOTE: This script is no longer needed since we now use $ref references
 * in schemas instead of embedding properties. With true JSON Schema references,
 * changes to person.schema.json are automatically reflected in all schemas
 * that reference it via "$ref": "./person.schema.json".
 * 
 * This script is preserved for reference in case we need to revert to
 * property embedding for compatibility reasons.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load the canonical person schema
const personSchema = JSON.parse(readFileSync(join(__dirname, '../schemas/person.schema.json'), 'utf8'));

// Schemas that include person details
const schemasWithPerson = [
  { file: 'cheese.schema.json', description: 'cheese evaluation' },
  { file: 'whiskey.schema.json', description: 'whiskey evaluation' }
];

console.log('🔄 Person Schema Synchronization');
console.log('================================');
console.log(`Source: person.schema.json (${Object.keys(personSchema.properties).length} properties)`);

for (const { file, description } of schemasWithPerson) {
  console.log(`\n📝 Updating ${file}...`);
  
  const schemaPath = join(__dirname, '../schemas', file);
  const targetSchema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  
  // Update the reviewer section with the latest person schema
  if (targetSchema.properties && targetSchema.properties.reviewer) {
    // Copy properties from person schema, updating descriptions for context
    const updatedReviewerProps = {};
    
    for (const [propName, propDef] of Object.entries(personSchema.properties)) {
      updatedReviewerProps[propName] = {
        ...propDef,
        description: propDef.description?.replace('Person\'s', 'Reviewer\'s') || propDef.description
      };
      
      // Customize experience level description for specific domains
      if (propName === 'experienceLevel') {
        if (file.includes('cheese')) {
          updatedReviewerProps[propName].description = 'Level of experience with cheese';
        } else if (file.includes('whiskey')) {
          updatedReviewerProps[propName].description = 'Level of experience with whiskey';
        }
      }
    }
    
    targetSchema.properties.reviewer.properties = updatedReviewerProps;
    targetSchema.properties.reviewer.required = personSchema.required;
    
    // Write back the updated schema
    writeFileSync(schemaPath, JSON.stringify(targetSchema, null, 2) + '\n');
    console.log(`  ✅ Updated reviewer properties in ${file}`);
    console.log(`  📊 Synchronized ${Object.keys(updatedReviewerProps).length} person properties`);
  } else {
    console.log(`  ❌ No reviewer section found in ${file}`);
  }
}

console.log('\n🎯 Synchronization Summary:');
console.log('==========================');
console.log(`✅ ${schemasWithPerson.length} schemas updated`);
console.log('✅ Person details remain consistent across all evaluation forms');
console.log('✅ Domain-specific customizations preserved');

console.log('\n💡 Next steps:');
console.log('- Run `task validate-schemas` to verify architecture integrity');
console.log('- Test forms in the application to ensure UI works correctly');
console.log('- Update OpenAPI documentation if needed');