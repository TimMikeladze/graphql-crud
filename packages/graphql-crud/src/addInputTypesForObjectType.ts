import {
  getNamedType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import {
  omitResolvers,
} from './';

export const toInputObjectName = (name: string): string => `${name}InputType`;

export const isValidInputType = (type, schema: GraphQLSchema): boolean => {
  if (type instanceof GraphQLList) {
    return isValidInputType(getNamedType(type), schema);
  }
  return !(type instanceof GraphQLObjectType);
};

export const getInputType = (object: any, schema: GraphQLSchema): GraphQLInputObjectType => {
  const type = schema.getType(toInputObjectName(object.type.name));
  return type as GraphQLInputObjectType;
};

export const addInputTypesForObjectType = (objectType: GraphQLObjectType, schema: GraphQLSchema) => {
  // Fields of an input type cannot have resolvers
  // console.log(objectType);
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
        const inputType = getInputType(field, schema);
        if (inputType) {
          field = {
            name: inputType.name,
            type: field.type instanceof GraphQLList ? new GraphQLList(inputType) : inputType,
          };
        } else {
          // Input type does not exist so we need to create it
          const fieldType = schema.getType(field.type.ofType || field.type.name); // `field.type.ofType` is used in case of a list type
          const newInputType = addInputTypesForObjectType(fieldType as GraphQLObjectType, schema);
          field = {
            name: newInputType.name,
            type: field.type instanceof GraphQLList ? new GraphQLList(newInputType) : newInputType,
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
