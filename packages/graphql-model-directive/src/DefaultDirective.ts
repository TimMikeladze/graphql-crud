import {
  GraphQLField,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export class DefaultDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    //
  }
}
