import i18next, { TOptions } from 'i18next';

// This function is a wrapper around i18next.t that returns an array of type T or string values
export const tArray = <T = string>(key: string, options?: TOptions): T[] => {
  // We use 'as unknown as T[]' because the internal $SpecialObject type cannot be directly cast to a specific T[].
  return i18next.t(key, {
    ...options,
    returnObjects: true
  } as any) as unknown as T[];
};

// This function is a wrapper around i18next.t that returns an object of keys of type T or string and string values
export const tObject = <T extends string | number | symbol = string, K = any>(
  key: string,
  options?: TOptions
): Record<T, K> => {
  return i18next.t(key, {
    ...options,
    returnObjects: true
  } as any) as unknown as Record<T, K>;
};
