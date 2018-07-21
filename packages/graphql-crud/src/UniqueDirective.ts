import { SchemaDirectiveVisitor } from 'graphql-tools';

export const createUniqueDirective = () => {
  return class UniqueDirective extends SchemaDirectiveVisitor {
  };
};
