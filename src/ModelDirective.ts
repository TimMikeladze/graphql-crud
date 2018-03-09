import {
  GraphQLObjectType,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export class ModelDirective extends SchemaDirectiveVisitor {
  public visitObjectDefinition(object: GraphQLObjectType) {
    // 
  }
}
