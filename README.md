# graphql-model-directive

**Note: this package is under active development**

Annotate a GraphQL schema with directives to generate CRUD queries, mutations and types with functioning resolvers.

## Getting started

1. Install core package: `npm install graphql-model-directive` or `yarn add graphql-model-directive`.
2. Install a storage package:
    - Mongo: `npm install graphql-model-mongo` or `yarn add graphql-model-mongo`.
3. Define your schema and annotate it with directives.
4. Use `makeExecutableSchema` to generate schema.

```javascript
import { makeExecutableSchema } from 'graphql-tools';
import model from 'graphql-model-directive';
import typeDefs from './typeDefs';

const typeDefs = `

type Item @model {
  name: String!
}

type Query {
  dummy: String
}

type Mutation {
  dummy: String
}

schema {
  query: Query
  mutation: Mutation
}
`

const schema = makeExecutableSchema({
  typeDefs,
  schemaDirectives: {
    ...model
  },
});
```

The above example will generate the following schema:

```graphql
type Item {
  id: ID!
  name: String
}

type Query {
  item: Item
  items: [Item]
  dummy: String
}

type Mutation {
  createItem(item: Item!): Item
  updateItem(item: Item!): Item
  upsertItem(item: Item!): Item
  # removeItem(where: Where)

  dummy: String
}
```


## Directives

- `@model`
- `@relation`
- `@unique`
- `@default`

## Getting started for development

1. `docker-compose up -d` to start dependent databases.
1. `npm install` or `yarn install`
