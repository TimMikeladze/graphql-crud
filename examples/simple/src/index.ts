import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { printSchema } from 'graphql';
import modelDirectives, { ModelDirective } from 'graphql-model-directive';
import MongoStore from 'graphql-model-mongo';
import { makeExecutableSchema } from 'graphql-tools';

const PORT = 3000;

const typeDefs = `
  type Item @model {
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
    ...modelDirectives,
  } as any,
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

console.log(printSchema(schema));
