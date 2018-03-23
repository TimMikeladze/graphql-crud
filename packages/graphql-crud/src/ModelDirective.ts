import {
  defaultFieldResolver,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import * as pluralize from 'pluralize';
import {
  addInputTypesForObjectType,
  generateFieldNames,
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

export interface UpdateResolverArgs {
  data: any;
  where: any;
  upsert: boolean;
}

export interface RemoveResolverArgs {
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
    // Generate corresponding input types for the given type.
    // Each field returning GraphQLObjectType in the given type will also
    // have input types generated recursively.
    addInputTypesForObjectType(type, this.schema);
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
      type: GraphQLBoolean,
      description: `Update a ${type.name}`,
      args: [
        {
          name: 'data',
          type: (this.schema.getType(names.input.type)),
        },
        {
          name: 'where',
          type: (this.schema.getType(names.input.type)),
        } as any,
        {
          name: 'upsert',
          type: GraphQLBoolean,
        } as any,
      ],
      resolve: (root, args: UpdateResolverArgs, context: ResolverContext) => {
        return context.directives.model.store.update({
          where: args.where,
          data: args.data,
          upsert: args.upsert,
          type,
        });
      },
      isDeprecated: false,
    };

    // remove mutation

    (this.schema.getMutationType() as any).getFields()[names.mutation.remove] = {
      name: names.mutation.remove,
      type: GraphQLBoolean,
      description: `Remove a ${type.name}`,
      args: [
        {
          name: 'where',
          type: (this.schema.getType(names.input.type)),
        } as any,
      ],
      resolve: (root, args: RemoveResolverArgs, context: ResolverContext) => {
        return context.directives.model.store.remove({
          where: args.where,
          type,
        });
      },
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
