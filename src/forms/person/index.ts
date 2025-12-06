import schema from '../../../schemas/person.schema.json';
import uischema from '../../../ui/person.jsonforms.json';
import { resolveSchemaReferences } from '../../utils/schemaResolver';

export const personSchema = resolveSchemaReferences(schema);
export const personUiSchema = uischema;