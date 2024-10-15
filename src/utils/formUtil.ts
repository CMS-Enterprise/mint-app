/* 
Util used to return only dirty formik fields
Formik has no dirty value per input, only on whole form
This returns a payload with only values that have changes
*/

import { isEqual } from 'lodash';

export function onChangeCheckboxHandler<T>(
  newValue: T,
  field: { value: T[]; onChange: (value: T[]) => void }
) {
  if (field.value.includes(newValue)) {
    field.onChange(field.value.filter((v: T) => v !== newValue));
  } else {
    field.onChange(
      Array.isArray(field.value) ? [...field.value, newValue] : [newValue]
    );
  }
}

type DirtyInputType = {
  [key: string]: any;
};

export const dirtyInput = (initialValues: any, values: any) => {
  console.log('initialValues', initialValues);
  console.log('values', values);
  if (!initialValues || !values) return {};

  const onlyDirtyInput: DirtyInputType = {};

  Object.keys(initialValues).forEach(field => {
    // Added conditional for 0 value, as number inputs are always initialized with 0, and it needs to be persisted even if not touched
    if (
      !isEqual(initialValues[field], values[field]) ||
      initialValues[field] === 0
    ) {
      onlyDirtyInput[field] = values[field];
    }
  });
  return onlyDirtyInput;
};

export default dirtyInput;
