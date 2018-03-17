# graphql-model-directive

**Note: this package is under active development**

Annotate a GraphQL schema with directives to generate queries and mutations which are automatically connected to a database.

**Supported databases:**

- Mongo

**Available directives:**

- `@model` - Generates queries and mutations backed by a database for the annotated type.

## Getting started

1. Install core package: `npm install graphql-model-directive` or `yarn add graphql-model-directive`.
2. Install a store package:
    - Mongo: `npm install graphql-model-mongo` or `yarn add graphql-model-mongo`.
3. Define your schema and annotate it with directives.
4. Use `makeExecutableSchema` to generate the schema.
5. Instantiate and assign your store to `directives.model.store` on the GraphQL `context`.

```javascript
import { makeExecutableSchema } from 'graphql-tools';
import { execute } from 'graphql';
import gql from 'graphql-tag';
import model from 'graphql-model-directive';
import typeDefs from './typeDefs';

const typeDefs = `

type Item @model {
  name: String
}

type Mutation {
  _: Boolean
}

type Query {
  _: Boolean
}
`

const schema = makeExecutableSchema({
  typeDefs,
  schemaDirectives: {
    ...model
  },
});

const context = {
  directives: {
    model: {
      store: new MongoStore({ connection: 'mongodb://localhost/my-database' }),
    },
  },
};

execute(
  schema,
  gql`
  mutate {
      createItem(
        data: {
          name: "hello world"
        }
      ) {
        id
        name
      }
  }
  `
  null,
  context
);
```

The above example will generate the following schema with functioning resolvers.

```graphql
type Item {
  name: String
  id: ID
}

input ItemInputType {
  name: String
  id: ID
}

type Mutation {
  _: Boolean

  createItem(data: ItemInputType): Item
  updateItem(data: ItemInputType, where: ItemInputType, upsert: Boolean): Boolean
  removeItem(where: ItemInputType): Boolean
}

type Query {
  _: Boolean

  item(where: ItemInputType): Item
  items(where: ItemInputType): [Item]
}
```

## Running the examples

In the repo's root run the following:
1. `docker-compose up -d` to start dependent databases.
1. `npm install` or `yarn install`

In `examples/simple` run the following:

1. `npm install; npm start` or `yarn install; yarn start`
1. Navigate to http://localhost:3000/graphiql


## Getting started for development

1. `docker-compose up -d` to start dependent databases.
1. `npm install` or `yarn install`
