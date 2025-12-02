import schema from '../../../schemas/cheese.schema.json';
import uischema from '../../../ui/cheese.jsonforms.json';
import { resolveSchemaReferences } from '../../utils/schemaResolver';

export const cheeseSchema = resolveSchemaReferences(schema);
export const cheeseUiSchema = uischema;
