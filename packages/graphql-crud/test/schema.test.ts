import { execute, printSchema } from 'graphql';
import MongoStore from 'graphql-crud-mongo';
import gql from 'graphql-tag';
import { makeExecutableSchema } from 'graphql-tools';
import { createGraphQLCrud } from '../src';
import typeDefs from './typeDefs';

describe('schema', () => {

  const context = {
    directives: {
      model: {
        store: new MongoStore({ connection: 'mongodb://localhost/my-database' }),
      },
    },
  };

  const schema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: createGraphQLCrud().schemaDirectives,
  });

  it('produces the expected schema', () => {
    expect(printSchema(schema)).toMatchSnapshot();
  });

  describe('mutations', () => {
    it('can create user', async () => {

      const res = await execute(
        schema,
        gql`

        mutation CreateUser {
          createUser(data: {
            username: "test-user-one"
          }) {
            id
            username
          }
        }

        `,
        null,
        context,
      );

      expect(res.data.createUser).toMatchObject({
        id: expect.any(String),
        username: 'test-user-one',
      });
    });
    it('can create user', async () => {

      const res = await execute(
        schema,
        gql`

        mutation CreateUser {
          createUser(data: {
            username: "test-user-one"
          }) {
            id
            username
          }
        }

        `,
        null,
        context,
      );

      expect(res.data.createUser).toMatchObject({
        id: expect.any(String),
        username: 'test-user-one',
      });

    });
  });
});
