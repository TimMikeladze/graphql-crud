# graphql-model-directive

**Note: this package is under active development**

Annotate a GraphQL schema with directives to generate CRUD queries, mutations and types with functioning resolvers.

## Getting started

Install package: `npm install graphql-model-directive` or `yarn add graphql-model-directive`.

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
  directives: {
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
