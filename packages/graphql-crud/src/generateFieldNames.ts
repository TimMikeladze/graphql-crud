import * as pluralize from 'pluralize';
const pascalCase = require('pascal-case'); // tslint:disable-line no-var-requires
const camelCase = require('camel-case'); // tslint:disable-line no-var-requires

export const generateFieldNames = (name) => {
  const names = {
    input: {
      type: `${pluralize.singular(pascalCase(name))}InputType`,
      mutation: {
        create: `Create${pluralize.singular(pascalCase(name))}InputType`,
        remove: `Remove${pluralize.singular(pascalCase(name))}InputType`,
        update: `Update${pluralize.singular(pascalCase(name))}InputType`,
      },
    },
    query: {
      one: pluralize.singular(camelCase(name)),
      many: pluralize.plural(camelCase(name)),
    },
    mutation: {
      create: `create${pluralize.singular(pascalCase(name))}`,
      remove: `remove${pluralize.singular(pascalCase(name))}`,
      update: `update${pluralize.singular(pascalCase(name))}`,
    },
  };

  return names;
};
