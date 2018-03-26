import {
  getNamedType,
  getNullableType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

export const toInputObjectTypeName = (name: string): string => `${name}InputType`;

export const isValidInputType = (type, schema: GraphQLSchema): boolean => {
  if (type instanceof GraphQLList) {
    return isValidInputType(getNamedType(type), schema);
  }
  return !(getNullableType(type) instanceof GraphQLObjectType);
};

export const getInputType = (typeName: string, schema: GraphQLSchema): GraphQLInputObjectType => {
  const type = schema.getType(toInputObjectTypeName(typeName));
  return type as GraphQLInputObjectType;
};
