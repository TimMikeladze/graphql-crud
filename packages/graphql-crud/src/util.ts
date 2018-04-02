import {
  getNamedType,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import {
  get,
} from 'lodash';

export const toInputObjectTypeName = (name: string): string => `${name}InputType`;

export const isValidInputFieldType = (type): boolean => {
  return !(getNamedType(type) instanceof GraphQLObjectType);
};

export const getInputType = (typeName: string, schema: GraphQLSchema): GraphQLInputObjectType => {
  const type = schema.getType(toInputObjectTypeName(typeName));
  return type as GraphQLInputObjectType;
};

export const isNonNullable = (type) => type.astNode && type.astNode.type.kind === 'NonNullType';

export const getObjectTypeFromInputType = (typeName: string, schema: GraphQLSchema): GraphQLObjectType => {
  const type = schema.getType(typeName.replace('InputType', ''));
  return type as GraphQLObjectType;
};

export const hasDirective = (directive, type) => {
  const directives = get(type, ['astNode', 'directives']);
  if (directives) {
    return directives.find((d) => d.name.value === directive);
  }
  return false;
};
