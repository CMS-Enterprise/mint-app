import { getKeys } from 'types/translation';

function mapDefaultFormValues<T extends {}>(
  values: T,
  defaultFormValues: T
): T {
  const mappedValues = { ...values };

  getKeys(values).forEach(key => {
    const value = values[key];
    if (value === null || value === undefined) {
      mappedValues[key] = defaultFormValues[key];
    }
  });

  return mappedValues;
}

export default mapDefaultFormValues;
