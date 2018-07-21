import { createModelDirective, createUniqueDirective, DefaultDirective, RelationDirective } from '.';

export const createGraphQLCrud = () => ({
  schemaDirectives: {
    model: createModelDirective(),
    default: DefaultDirective,
    relation: RelationDirective,
    unique: createUniqueDirective(),
  },
});
