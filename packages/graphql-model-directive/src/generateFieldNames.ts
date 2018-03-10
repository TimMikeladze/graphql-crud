import camelCase from 'camel-case';
import pascalCase from 'pascal-case';
import pluralize from 'pluralize';

export const generateFieldNames = (name) => {
  const names = {
    input: {
      create: `Create${pluralize.singular(pascalCase(name))}InputType`,
      remove: `Remove${pluralize.singular(pascalCase(name))}InputType`,
      update: `Update${pluralize.singular(pascalCase(name))}InputType`,
      upsert: `Upsert${pluralize.singular(pascalCase(name))}InputType`,
    },
    query: {
      one: pluralize.singular(camelCase(name)),
      many: pluralize.plural(camelCase(name)),
    },
    mutation: {
      create: `create${pluralize.singular(pascalCase(name))}`,
      remove: `remove${pluralize.singular(pascalCase(name))}`,
      update: `update${pluralize.singular(pascalCase(name))}`,
      upsert: `upsert${pluralize.singular(pascalCase(name))}`,
    },
  };

  return names;
};
