import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

import camelCase from 'camel-case';
import pascalCase from 'pascal-case';
import pluralize from 'pluralize';

export class ModelDirective extends SchemaDirectiveVisitor {
  public static generateFieldNames(name) {
    const names = {
      input: {
        create: `Create${pluralize.singular(pascalCase(name))}InputType`,
        remove: `Remove${pluralize.singular(pascalCase(name))}InputType`,
        update: `Update${pluralize.singular(pascalCase(name))}InputType`,
        upsert: `Upsert${pluralize.singular(pascalCase(name))}InputType`,
      },
      query: {
        one: pluralize.singular(camelCase(name)),
        many: pluralize.plural(camelCase(name)),
      },
      mutation: {
        create: `create${pluralize.singular(pascalCase(name))}`,
        remove: `remove${pluralize.singular(pascalCase(name))}`,
        update: `update${pluralize.singular(pascalCase(name))}`,
        upsert: `upsert${pluralize.singular(pascalCase(name))}`,
      },
    };

    return names;
  }

  public visitObject(type: GraphQLObjectType) {
    // TODO check that id field does not already exist on type
    // Add an "id" field to the object type.
    type.getFields().id = {
      name: 'id',
      type: GraphQLID,
      description: 'Unique ID',
      args: [],
      resolve: () => null,
    };

    // Modify root Mutation type to add create, update, upsert, and remove mutations
    this.addMutations(type);

    // Modify root Query type to add "find one" and "find many" queries
    this.addQueries(type);
  }

  private addMutations(type: GraphQLObjectType) {
    const names = ModelDirective.generateFieldNames(type.name);

    // TODO add check to make sure mutation root type is defined and if not create it
    (this.schema.getMutationType() as any).getFields()[names.mutation.create] = {
      name: names.mutation.create,
      type,
      description: `Create a ${type.name}`,
      args: [
        {
          name: 'data',
          type: new GraphQLNonNull(type),
        },
      ],
      resolve: () => null,
    };

    (this.schema.getMutationType() as any).getFields()[names.mutation.update] = {
      name: names.mutation.update,
      type,
      description: `Update a ${type.name}`,
      args: [
        {
          name: 'data',
          type: new GraphQLNonNull(type),
        },
      ],
      resolve: () => null,
    };

    (this.schema.getMutationType() as any).getFields()[names.mutation.upsert] = {
      name: names.mutation.upsert,
      type,
      description: `Update a ${type.name} or create it if it doesn't exist`,
      args: [
        {
          name: 'data',
          type: new GraphQLNonNull(type),
        },
      ],
      resolve: () => null,
    };

    (this.schema.getMutationType() as any).getFields()[names.mutation.remove] = {
      name: names.mutation.remove,
      type,
      description: `Remove a ${type.name}`,
      args: [],
      resolve: () => null,
    };
  }

  private addQueries(type: GraphQLObjectType) {
    const names = ModelDirective.generateFieldNames(type.name);

    this.schema.getQueryType().getFields()[names.query.one] = {
      name: names.query.one,
      type,
      description: `Find one ${type.name}`,
      args: [],
      resolve: () => null,
    };

    this.schema.getQueryType().getFields()[names.query.many] = {
      name: names.query.many,
      type,
      description: `Find multiple ${pluralize(type.name)}`,
      args: [],
      resolve: () => null,
    };
  }
}
