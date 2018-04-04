import { printSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { ModelDirective } from '../src';
import typeDefs from './typeDefs';

describe('ModelDirective', () => {
  const schema = makeExecutableSchema({
    typeDefs,
    schemaDirectives: {
      model: ModelDirective,
    } as any,
  });

  it('produces the expected schema', () => {
    expect(printSchema(schema)).toMatchSnapshot();
  });
});
