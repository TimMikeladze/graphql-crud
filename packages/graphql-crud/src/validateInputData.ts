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

export interface ValidateInputDataProps {
  type: GraphQLObjectType;
  schema: GraphQLSchema;
  data: object;
  skipMissingFields?: boolean;
}

// For every null value in the input data
// check that it can be nullable by check the type definition.
export const validateInputData = (props: ValidateInputDataProps) => {
  if (isEmpty(props.data)) {
    throw new Error('data input object is missing');
  }

  const fields = props.type.getFields();

  Object
    .keys(fields)
    .forEach((key) => {
      const field = fields[key];
      const value = props.data[key];
      // Encountered an input object within the data. Recursively call this function.
      if (isPlainObject(value)) {
        validateInputData({
          schema: props.schema,
          data: value,
          type: getNullableType(field.type) as any,
          skipMissingFields: props.skipMissingFields,
        });
      } else {
        // IF the field value provided is null and the field is non nullable
        // OR the field was not provided but is marked as non nullable in the input type
        //  AND skipMissingFields is marked false
        if (value === null && isNonNullable(field) || !props.data[key] && isNonNullable(field) && !props.skipMissingFields) {
          throw new Error(`${props.type.name}.${field.name} must not be null`);
        }
      }
    });
};
