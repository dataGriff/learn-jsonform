import schema from '../../../schemas/whiskey.schema.json';
import uischema from '../../../ui/whiskey.jsonforms.json';
import { resolveSchemaReferences } from '../../utils/schemaResolver';

export const whiskeySchema = resolveSchemaReferences(schema);
export const whiskeyUiSchema = uischema;
