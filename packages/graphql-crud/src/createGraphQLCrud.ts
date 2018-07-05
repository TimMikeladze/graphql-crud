import { createModelDirective, DefaultDirective, RelationDirective, UniqueDirective } from '.';

export const createGraphQLCrud = () => ({
  schemaDirectives: {
    model: createModelDirective(),
    default: DefaultDirective,
    relation: RelationDirective,
    unique: UniqueDirective,
  },
});
