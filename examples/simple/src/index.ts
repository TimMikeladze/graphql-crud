import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { printSchema } from 'graphql';
import model, { ModelDirective } from 'graphql-model-directive';
import { MongoStorage } from 'graphql-model-mongo';
import { makeExecutableSchema } from 'graphql-tools';

const PORT = 3000;

const typeDefs = `
  type Foo @model {
    name: String
  }

  type Query {
    dummy: String
  }

  type Mutation {
    dummy: String
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  directives: {
    model: ModelDirective,
  } as any,
});

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled

app.listen(PORT);
