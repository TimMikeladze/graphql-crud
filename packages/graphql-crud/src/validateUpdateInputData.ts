import {
  getNullableType,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import {
  isEmpty,
  isPlainObject,
} from 'lodash';

import {
  isNonNullable,
} from './';

export interface ValidateUpdateInputDataProps {
  type: GraphQLObjectType;
  schema: GraphQLSchema;
  data: object;
}

// For every null value in the input data
// check that it can be nullable by check the type definition.
export const validateUpdateInputData = (props: ValidateUpdateInputDataProps) => {
  if (isEmpty(props.data)) {
    throw new Error('data input object is missing');
  }

  const fields = props.type.getFields();

  Object
    .keys(props.data)
    .forEach((key) => {
      const field = fields[key];
      const value = props.data[key];
      if (isPlainObject(value)) {
        validateUpdateInputData({
          schema: props.schema,
          data: value,
          type: getNullableType(field.type) as any,
        });
      } else {
        if (value === null && isNonNullable(field)) {
          throw new Error(`${props.type.name}.${field.name} must not be null`);
        }
      }
    });
};
