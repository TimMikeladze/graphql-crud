import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import {
  getInputType,
  isValidInputType,
  omitResolvers,
  toInputObjectTypeName,
} from './';

export interface AddInputTypesForObjectTypeProps {
  objectType: GraphQLObjectType;
  schema: GraphQLSchema;
  prefix?: string;
  modifyField?: (field: any) => any;
}

export const addInputTypesForObjectType = ({
  objectType,
  schema,
  prefix = '',
  modifyField = (field) => field,
}: AddInputTypesForObjectTypeProps) => {
  // Fields of an input type cannot have resolvers
  // console.log(objectType);
  const fields = omitResolvers(objectType.getFields());

  // Create the corresponding input type.
  // For example, if given `type Foo` will create `input FooInputType`
  let inputObjectType = new GraphQLInputObjectType({
    name: `${prefix}${toInputObjectTypeName(objectType.name)}`,
    fields,
  });

  // Adds the newly created input type to the type map.
  //
  // Note: the GraphQLObjectType fields of the input type have not yet been replaced.
  // However weneed a reference to the input type added to the type map for lookups during recursion.
  schema.getTypeMap()[inputObjectType.name] = inputObjectType;

  // Iterate over each field in the input type.
  // If the field's type is not a GraphQLObjectType or a GraphQLList then it is copied as is.
  // If the field's type is a GraphQLObjectType or a GraphQLList
  //  Get the type which the GraphQLList contains
  //  Find (or create if not found) the corresponding input type
  //  Replace the field's type with the input type
  const inputObjectFields = Object
    .keys(fields)
    .reduce((res, key) => {
      let field = fields[key];

      if (!isValidInputType(field.type, schema)) {
        // Check if the input type already exists
        const inputType = getInputType(`${prefix}${field.type.name}`, schema);
        if (inputType) {
          field = {
            name: inputType.name,
            type: field.type instanceof GraphQLList ? new GraphQLList(inputType) : inputType,
          };
        } else {
          // Input type does not exist so we need to create it
          const fieldType = schema.getType(field.type.ofType || field.type.name); // `field.type.ofType` is used in case of a list type
          const newInputType = addInputTypesForObjectType({
            objectType: fieldType as GraphQLObjectType,
            schema,
            prefix,
            modifyField,
         });
          field = {
            name: newInputType.name,
            type: field.type instanceof GraphQLList ? new GraphQLList(newInputType) : newInputType,
          };
        }
      }

      return {
        ...res,
        [key]: modifyField(field),
      };
    }, {});

  // Replace our original inputObjectType with new one containing the modified fields

  inputObjectType = new GraphQLInputObjectType({
    name: inputObjectType.name,
    fields: inputObjectFields,
  });

  schema.getTypeMap()[inputObjectType.name] = inputObjectType;

  return inputObjectType;
};
