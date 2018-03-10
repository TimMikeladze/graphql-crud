export * from './ModelDirective';
export * from './RelationDirective';
export * from './DefaultDirective';
export * from './UniqueDirective';
export * from './Storage';
export * from './generateFieldNames';

import { DefaultDirective } from './DefaultDirective';
import { ModelDirective } from './ModelDirective';
import { RelationDirective } from './RelationDirective';
import { UniqueDirective } from './UniqueDirective';

export default {
  model: ModelDirective,
  default: DefaultDirective,
  relation: RelationDirective,
  unique: UniqueDirective,
};
