import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import crud from 'graphql-crud';
import MongoStore from 'graphql-crud-mongo';
import { makeExecutableSchema } from 'graphql-tools';

const PORT = 3000;

const typeDefs = `
  type Item @model {
    name: String
    subItem: SubItem
  }

  type SubItem {
    name: String
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  schemaDirectives: {
    ...crud,
  },
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
