import {
  GraphQLField,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export class RelationDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    //
  }
}
