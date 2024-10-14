/* 
Util used to return only dirty formik fields
Formik has no dirty value per input, only on whole form
This returns a payload with only values that have changes
*/

import { isEqual } from 'lodash';

type DirtyInputType = {
  [key: string]: any;
};

export const dirtyInput = (initialValues: any, values: any) => {
  if (!initialValues || !values) return {};

  const onlyDirtyInput: DirtyInputType = {};

  console.log(initialValues, values);

  Object.keys(initialValues).forEach(field => {
    // Added conditional for 0 value, as number inputs are always initialized with 0, and it needs to be persisted even if not touched
    if (
      !isEqual(initialValues[field], values[field]) ||
      initialValues[field] === 0
    ) {
      console.log(initialValues[field], values[field]);
      onlyDirtyInput[field] = values[field];
    }
  });
  return onlyDirtyInput;
};

export default dirtyInput;
