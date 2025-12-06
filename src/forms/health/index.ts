import schema from '../../../schemas/health.schema.json';
import uischema from '../../../ui/health.jsonforms.json';
import { resolveSchemaReferences } from '../../utils/schemaResolver';

export const healthSchema = resolveSchemaReferences(schema);
export const healthUiSchema = uischema;