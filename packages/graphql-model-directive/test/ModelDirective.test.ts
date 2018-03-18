import { printSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { ModelDirective } from '../src';

const baseTypeDefs = `
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

describe('ModelDirective', () => {
  const typeDefs = `
  type Foo @model {
    name: String
    relation: Foo
    child: Bar
  }

  type Bar {
    name: String
    relation: Foo
    child: Dummy
    relation: Dummy
  }

  type Dummy {
    name: String
    relation: Bar
  }
  ${baseTypeDefs}
`;

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
