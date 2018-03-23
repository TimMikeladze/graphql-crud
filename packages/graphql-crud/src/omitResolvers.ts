import { omitBy } from 'lodash';

export const omitResolvers = (fields) => {
  return Object
    .keys(fields)
    .reduce((res, key) => {
      const value = omitBy(fields[key], (value, key) => key === 'resolve');
      return {
        ...res,
        [key]: value,
      };
    }, {});
};
