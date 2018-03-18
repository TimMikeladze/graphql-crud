import {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import {
  omitResolvers,
} from './';

export const toInputObjectName = (name: string): string => `${name}InputType`;

export const isObjectType = (object, schema: GraphQLSchema): boolean => {
  const type = schema.getType(object.type);
  return type instanceof GraphQLObjectType;
};

export const getInputType = (object: any, schema: GraphQLSchema): GraphQLInputObjectType => {
  const type = schema.getType(toInputObjectName(object.type.name));
  return type as GraphQLInputObjectType;
};

export const addInputTypesForObjectType = (objectType: GraphQLObjectType, schema: GraphQLSchema) => {
  // Fields of an input type cannot have resolvers
  const fields = omitResolvers(objectType.getFields());

  // Create the corresponding input type.
  // For example, if given `type Foo` will create `input FooInputType`
  let inputObjectType = new GraphQLInputObjectType({
    name: toInputObjectName(objectType.name),
    fields,
  });

  // Adds the newly created input type to the type map.
  //
  // Note: the GraphQLObjectType fields of the input type have not yet been replaced.
  // However weneed a reference to the input type added to the type map for lookups during recursion.
  schema.getTypeMap()[inputObjectType.name] = inputObjectType;

  // Iterate over each field in the input type.
  // If the field's type is not a GraphQLObjectType then it is copied as is.
  // If the field's type is a GraphQLObjectType
  //  Find (or create if not found) the corresponding input type
  //  Replace the field's type with the input type
  const inputObjectFields = Object
    .keys(fields)
    .reduce((res, key) => {
      let field = fields[key];

      if (isObjectType(field, schema)) {
        // Check if the input type already exists
        const inputType = getInputType(field, schema);
        if (inputType) {
          field = {
            name: inputType.name,
            type: inputType,
          };
        } else {
          // Input type does not exist so we need to create it
          const fieldType = schema.getType(field.type.name) as GraphQLObjectType;
          const newInputType = addInputTypesForObjectType(fieldType, schema);
          field = {
            name: newInputType.name,
            type: newInputType,
          };
        }
      }

      return {
        ...res,
        [key]: field,
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
