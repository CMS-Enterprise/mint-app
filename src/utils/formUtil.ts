/* 
Util used to return only dirty formik fields
Formik has no dirty value per input, only on whole form
This returns a payload with only values that have changes
*/

import { isEqual } from 'lodash';

export function onChangeCheckboxHandler<T>(
  newValue: T,
  field: { value: T[]; onChange: (value: T[]) => void },
  deselectOthers?: boolean
) {
  if (field.value.includes(newValue)) {
    field.onChange(field.value.filter((v: T) => v !== newValue));
  } else if (deselectOthers) {
    field.onChange([newValue]);
  } else {
    field.onChange(
      Array.isArray(field.value) ? [...field.value, newValue] : [newValue]
    );
  }
}

export const symmetricDifference = (
  a1: (string | number)[],
  a2: (string | number)[]
) => {
  const result = [];
  for (let i = 0; i < a1.length; i += 1) {
    if (a2.indexOf(a1[i]) === -1) {
      result.push(a1[i]);
    }
  }
  for (let i = 0; i < a2.length; i += 1) {
    if (a1.indexOf(a2[i]) === -1) {
      result.push(a2[i]);
    }
  }
  return result;
};

type DirtyInputType = {
  [key: string]: any;
};

export const dirtyInput = (initialValues: any, values: any) => {
  if (!initialValues || !values) return {};

  const onlyDirtyInput: DirtyInputType = {};

  Object.keys(initialValues).forEach(field => {
    // Added conditional for 0 value, as number inputs are always initialized with 0, and it needs to be persisted even if not touched
    if (
      typeof initialValues[field] === 'object' &&
      !isEqual(initialValues[field], values[field])
    ) {
      onlyDirtyInput[field] = values[field];
    } else if (
      !isEqual(initialValues[field], values[field]) ||
      initialValues[field] === 0
    ) {
      onlyDirtyInput[field] = values[field];
    }
  });
  return onlyDirtyInput;
};

export default dirtyInput;
