import {
  defaultFieldResolver,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import * as pluralize from 'pluralize';
import {
  generateFieldNames,
  omitResolvers,
  Store,
} from './';

export interface ResolverContext {
  directives: {
    model: {
      store: Store;
    },
  };
  [key: string]: any;
}

export interface CreateResolverArgs {
  data: any;
}

export interface FindOneResolverArgs {
  where: any;
}

export interface FindResolverArgs {
  where: any;
}

export class ModelDirective extends SchemaDirectiveVisitor {
  public visitObject(type: GraphQLObjectType) {
    // TODO check that id field does not already exist on type
    // Add an "id" field to the object type.
    //
    type.getFields().id = {
      name: 'id',
      type: GraphQLID,
      description: 'Unique ID',
      args: [],
      resolve: defaultFieldResolver,
      isDeprecated: false,
    };

    // Modify schema with input types generated based off of the given type
    this.addInputTypes(type);

    // Modify root Mutation type to add create, update, upsert, and remove mutations
    this.addMutations(type);

    // Modify root Query type to add "find one" and "find many" queries
    this.addQueries(type);
  }

  private addInputTypes(type: GraphQLObjectType) {
    const names = generateFieldNames(type.name);

    // Create an input type with identical fields as the current type.
    // Since input type fields can't have resolvers we omit them.
    this.schema.getTypeMap()[names.input.type] = new GraphQLInputObjectType({
      name: names.input.type,
      fields: () => omitResolvers(type.getFields()),
    });
  }

  private addMutations(type: GraphQLObjectType) {
    const names = generateFieldNames(type.name);

    // TODO add check to make sure mutation root type is defined and if not create it

    // create mutation

    (this.schema.getMutationType() as any).getFields()[names.mutation.create] = {
      name: names.mutation.create,
      type,
      description: `Create a ${type.name}`,
      args: [
        {
          name: 'data',
          type: (this.schema.getType(names.input.type)),
        },
      ],
      resolve: (root, args: CreateResolverArgs, context: ResolverContext) => {
        return context.directives.model.store.create({
          data: args.data,
          type,
        });
      },
      isDeprecated: false,
    };

    // update mutation

    (this.schema.getMutationType() as any).getFields()[names.mutation.update] = {
      name: names.mutation.update,
      type,
      description: `Update a ${type.name}`,
      args: [
        {
          name: 'data',
          type: (this.schema.getType(names.input.type)),
        },

      ],
      resolve: defaultFieldResolver,
      isDeprecated: false,
    };

    // upsert mutation

    (this.schema.getMutationType() as any).getFields()[names.mutation.upsert] = {
      name: names.mutation.upsert,
      type,
      description: `Update a ${type.name} or create it if it doesn't exist`,
      args: [
        {
          name: 'data',
          type: (this.schema.getType(names.input.type)),
        },
      ],
      resolve: defaultFieldResolver,
      isDeprecated: false,
    };

    // remove mutation

    (this.schema.getMutationType() as any).getFields()[names.mutation.remove] = {
      name: names.mutation.remove,
      type,
      description: `Remove a ${type.name}`,
      args: [],
      resolve: defaultFieldResolver,
      isDeprecated: false,
    };
  }

  private addQueries(type: GraphQLObjectType) {
    const names = generateFieldNames(type.name);

    // find one query

    this.schema.getQueryType().getFields()[names.query.one] = {
      name: names.query.one,
      type,
      description: `Find one ${type.name}`,
      args: [
        {
          name: 'where',
          type: (this.schema.getType(names.input.type)),
        } as any,
      ],
      resolve: (root, args: FindOneResolverArgs, context: ResolverContext) => {
        return context.directives.model.store.findOne({
          where: args.where,
          type,
        });
      },
      isDeprecated: false,
    };

    // find many query

    this.schema.getQueryType().getFields()[names.query.many] = {
      name: names.query.many,
      type: new GraphQLList(type),
      description: `Find multiple ${pluralize.plural(type.name)}`,
      args: [
        {
          name: 'where',
          type: (this.schema.getType(names.input.type)),
        } as any,
      ],
      resolve: (root, args: FindResolverArgs, context: ResolverContext) => {
        return context.directives.model.store.find({
          where: args.where,
          type,
        });
      },
      isDeprecated: false,
    };
  }
}
