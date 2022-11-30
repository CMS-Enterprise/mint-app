/* 
Util used to return only dirty formik fields
Formik has no dirty value per input, only on whole form
This returns a payload with only values that have changes
*/

type DirtyInputType = {
  [key: string]: any;
};

export const dirtyInput = (initialValues: any, values: any) => {
  if (!initialValues || !values) return {};

  const onlyDirtyInput: DirtyInputType = {};

  Object.keys(initialValues).forEach(field => {
    if (initialValues[field] !== values[field]) {
      onlyDirtyInput[field] = values[field];
    }
  });
  return onlyDirtyInput;
};

export default dirtyInput;
