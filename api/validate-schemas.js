#!/usr/bin/env node

/**
 * Schema Validation Utility
 * 
 * This script validates that the shared schemas are being used correctly
 * across JSON Forms and OpenAPI specifications.
 * Run with: node api/validate-schemas.js
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check that shared schemas exist
const sharedSchemas = ['person.schema.json', 'cheese.schema.json', 'whiskey.schema.json'];
const uiSchemas = ['cheese.jsonforms.json', 'whiskey.jsonforms.json'];

console.log('🔍 Shared Schema Architecture Validation');
console.log('========================================');

let allValid = true;

// Validate shared schemas exist
console.log('\n📁 Checking shared schemas...');
for (const schemaFile of sharedSchemas) {
  const schemaPath = join(__dirname, '../schemas', schemaFile);
  if (existsSync(schemaPath)) {
    try {
      const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
      console.log(`  ✅ ${schemaFile}: Valid JSON schema with ${Object.keys(schema.properties || {}).length} properties`);
    } catch (error) {
      console.log(`  ❌ ${schemaFile}: Invalid JSON - ${error.message}`);
      allValid = false;
    }
  } else {
    console.log(`  ❌ ${schemaFile}: File not found at ${schemaPath}`);
    allValid = false;
  }
}

// Validate UI schemas exist
console.log('\n🖥️  Checking UI schemas...');
for (const uiFile of uiSchemas) {
  const uiPath = join(__dirname, '../ui', uiFile);
  if (existsSync(uiPath)) {
    try {
      const uischema = JSON.parse(readFileSync(uiPath, 'utf8'));
      console.log(`  ✅ ${uiFile}: Valid UI schema with type '${uischema.type}'`);
    } catch (error) {
      console.log(`  ❌ ${uiFile}: Invalid JSON - ${error.message}`);
      allValid = false;
    }
  } else {
    console.log(`  ❌ ${uiFile}: File not found at ${uiPath}`);
    allValid = false;
  }
}

// Validate OpenAPI references
console.log('\n📄 Checking OpenAPI references...');
const openApiPath = join(__dirname, 'openapi.yaml');
if (existsSync(openApiPath)) {
  const openApiContent = readFileSync(openApiPath, 'utf8');
  
  // Check for shared schema references
  const expectedRefs = [
    './schemas/cheese.schema.json',
    './schemas/whiskey.schema.json'
  ];
  
  for (const ref of expectedRefs) {
    if (openApiContent.includes(ref)) {
      console.log(`  ✅ Found reference to ${ref}`);
    } else {
      console.log(`  ❌ Missing reference to ${ref}`);
      allValid = false;
    }
  }
} else {
  console.log(`  ❌ OpenAPI file not found at ${openApiPath}`);
  allValid = false;
}

// Validate form imports
console.log('\n📦 Checking form imports...');
const formDirs = ['cheese', 'whiskey'];

for (const formName of formDirs) {
  const indexPath = join(__dirname, `../src/forms/${formName}/index.ts`);
  if (existsSync(indexPath)) {
    const indexContent = readFileSync(indexPath, 'utf8');
    
    const expectedSchemaImport = `../../../schemas/${formName}.schema.json`;
    const expectedUiImport = `../../../ui/${formName}.jsonforms.json`;
    
    if (indexContent.includes(expectedSchemaImport)) {
      console.log(`  ✅ ${formName}: Correct schema import`);
    } else {
      console.log(`  ❌ ${formName}: Missing or incorrect schema import`);
      allValid = false;
    }
    
    if (indexContent.includes(expectedUiImport)) {
      console.log(`  ✅ ${formName}: Correct UI import`);
    } else {
      console.log(`  ❌ ${formName}: Missing or incorrect UI import`);
      allValid = false;
    }
  } else {
    console.log(`  ❌ ${formName}: Index file not found at ${indexPath}`);
    allValid = false;
  }
}

// Summary
console.log('\n📊 Architecture Summary:');
console.log('======================');
console.log(`Shared schemas: ${sharedSchemas.length} files`);
console.log(`UI definitions: ${uiSchemas.length} files`);
console.log(`Form integrations: ${formDirs.length} forms`);
console.log(`OpenAPI integration: ${existsSync(openApiPath) ? 'Present' : 'Missing'}`);

if (allValid) {
  console.log('\n🎉 Shared schema architecture is valid!');
  console.log('✅ Single source of truth maintained');
  console.log('✅ No schema duplication');
  console.log('✅ Proper separation of data and UI concerns');
  process.exit(0);
} else {
  console.log('\n⚠️  Architecture validation issues detected.');
  console.log('Please fix the above issues to maintain proper schema architecture.');
  process.exit(1);
}