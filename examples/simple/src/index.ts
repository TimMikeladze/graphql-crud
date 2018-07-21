import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { createGraphQLCrud } from 'graphql-crud';
import MongoStore from 'graphql-crud-mongo';
import { makeExecutableSchema } from 'graphql-tools';

const PORT = 3000;

const typeDefs = `

type Role @model{
  key: String!
  title: String!
  description: String
  users: [User]
  userGroups: [UserGroup]
}

type UserGroup @model {
  title: String!
  description: String
  users: [User]
  userRoles: [Role]
}

type User @model {
  username: String
  userGroups: [UserGroup]
  userRoles: [Role]
}

type Query {
  _: Boolean
}

type Mutation {
  _: Boolean
}`;

const schema = makeExecutableSchema({
  typeDefs,
  schemaDirectives: createGraphQLCrud().schemaDirectives,
});

const context = {
  directives: {
    model: {
      store: new MongoStore({ connection: 'mongodb://localhost/my-database' }),
    },
  },
};

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, context }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(PORT);
