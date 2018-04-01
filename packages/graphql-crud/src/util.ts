import {
  getNamedType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

export const toInputObjectTypeName = (name: string): string => `${name}InputType`;

export const isValidInputFieldType = (type): boolean => {
  return !(getNamedType(type) instanceof GraphQLObjectType);
};

export const getInputType = (typeName: string, schema: GraphQLSchema): GraphQLInputObjectType => {
  const type = schema.getType(toInputObjectTypeName(typeName));
  return type as GraphQLInputObjectType;
};

export const isNonNullable = (type) => type.astNode && type.astNode.type.kind === 'NonNullType';
