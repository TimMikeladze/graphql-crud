import { printSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { withGraphQLCrudDirectives } from '../src';
import typeDefs from './typeDefs';

describe('ModelDirective', () => {
  const schema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: withGraphQLCrudDirectives({

    })({}),
  });

  it('produces the expected schema', () => {
    expect(printSchema(schema)).toMatchSnapshot();
  });
});
