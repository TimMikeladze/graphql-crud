# graphql-crud

[![CircleCI](https://circleci.com/gh/Intelight/graphql-crud.svg?style=svg)](https://circleci.com/gh/Intelight/graphql-crud)

**Note: This package is under active development.**

GraphQL schema directives to generate CRUD queries, mutations and resolvers which are automatically connected to a database.

**Supported databases:**

- Mongo

_Database of your choice missing? Adding one is easy  - implement the [Store](https://github.com/Intelight/graphql-crud/blob/master/packages/graphql-crud/src/Store.ts) interface._

**Available directives:**

- `@model` - Generates queries, mutations and resolvers for the annotated type.

## Getting started

1. Install core package: `npm install graphql-crud` or `yarn add graphql-crud`.
2. Install a store package:
    - Mongo: `npm install graphql-crud-mongo` or `yarn add graphql-crud-mongo`.
3. Define your schema and annotate it with directives.
4. Use `makeExecutableSchema` to generate the schema.
5. Instantiate and assign your store to `directives.model.store` on the GraphQL `context`.

```javascript
import { makeExecutableSchema } from 'graphql-tools';
import { execute } from 'graphql';
import gql from 'graphql-tag';
import crud from 'graphql-crud';
import MongoStore from 'graphql-crud-mongo';
import typeDefs from './typeDefs';

const typeDefs = `

type Author @model {
  name: String!
  books: [Book]
  favoriteBook: Book
}

type Book @model {
  name: String!
  authors: [Author]
}

type Query {
  _: Boolean
}

type Mutation {
  _: Boolean
}

`

const schema = makeExecutableSchema({
  typeDefs,
  schemaDirectives: {
    ...crud
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
  mutation {
    createAuthor(data: {
      name:"Leo Tolstoy"
    }) {
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
"type Author {
  name: String
  books: [Book]
  id: ID
}

input AuthorInputType {
  name: String
  books: [BookInputType]
  id: ID
}

type Book {
  name: String
  authors: [Author]
  id: ID
}

input BookInputType {
  name: String
  authors: [AuthorInputType]
  id: ID
}

type Mutation {
  _: Boolean
  createAuthor(data: AuthorInputType): Author
  updateAuthor(data: UpdateAuthorInputType, where: UpdateAuthorInputType, upsert: Boolean): Boolean
  removeAuthor(where: AuthorInputType): Boolean
  createBook(data: BookInputType): Book
  updateBook(data: UpdateBookInputType, where: UpdateBookInputType, upsert: Boolean): Boolean
  removeBook(where: BookInputType): Boolean
}

type Query {
  _: Boolean
  author(where: AuthorInputType): Author
  authors(where: AuthorInputType): [Author]
  book(where: BookInputType): Book
  books(where: BookInputType): [Book]
}

input UpdateAuthorInputType {
  name: String
  books: [UpdateBookInputType]
  id: ID
}

input UpdateBookInputType {
  name: String
  authors: [UpdateAuthorInputType]
  id: ID
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

1. `docker-compose up -d` to start database dependencies for testing and the example.
1. `npm install` or `yarn install`.
1. `npm run link:packages` or `yarn link:packages`.
1. `npm run build:watch` or `yarn build:watch`
1. Write code.
