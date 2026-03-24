import i18next, { TOptions } from 'i18next';

// This function is a wrapper around i18next.t that returns an array of type T or string values
export const tArray = <T = string>(key: string, options?: TOptions) =>
  i18next.t<string, { returnObjects: true } & TOptions, string[]>(key, {
    ...options,
    returnObjects: true
  }) as T[];

// This function is a wrapper around i18next.t that returns an object of keys of type T or string and string values
export const tObject = <
  T extends string | number | symbol = string,
  K = string
>(
  key: string,
  options?: TOptions
) =>
  i18next.t<string, { returnObjects: true } & TOptions, Record<string, string>>(
    key,
    {
      ...options,
      returnObjects: true
    }
  ) as Record<T, K>;
