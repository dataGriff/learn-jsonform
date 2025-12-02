import type { JsonSchema, UISchemaElement } from '@jsonforms/core';

export interface FormDefinition {
  schema: JsonSchema;
  uischema: UISchemaElement;
  label: string;
}

export class FormRegistry {
  private static forms: Map<string, FormDefinition> = new Map();

  static async loadForm(formName: string): Promise<FormDefinition> {
    if (!this.forms.has(formName)) {
      try {
        // Use fetch for JSON files since they're static assets
        const [schemaResponse, uischemaResponse] = await Promise.all([
          fetch(`/schemas/${formName}.schema.json`),
          fetch(`/ui/${formName}.jsonforms.json`)
        ]);
        
        if (!schemaResponse.ok) {
          throw new Error(`Schema not found: ${schemaResponse.status}`);
        }
        if (!uischemaResponse.ok) {
          throw new Error(`UI Schema not found: ${uischemaResponse.status}`);
        }
        
        const [schema, uischema] = await Promise.all([
          schemaResponse.json(),
          uischemaResponse.json()
        ]);
        
        const formDef: FormDefinition = {
          schema,
          uischema,
          label: schema.title || this.capitalizeFirst(formName)
        };
        
        this.forms.set(formName, formDef);
      } catch (error) {
        console.warn(`Failed to load form ${formName}:`, error);
        throw new Error(`Form ${formName} not found: ${error}`);
      }
    }
    
    return this.forms.get(formName)!;
  }

  static getLoadedForms(): string[] {
    return Array.from(this.forms.keys());
  }

  private static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}