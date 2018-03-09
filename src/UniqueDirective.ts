import {
  GraphQLField,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export class UniqueDirective extends SchemaDirectiveVisitor {
  public visitFieldDefinition(field: GraphQLField<any, any>) {
    //
  }
}
