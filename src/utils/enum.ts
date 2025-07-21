const isEnumValue = <T extends object>(
  enumType: T,
  value: unknown
): value is T[keyof T] => {
  return Object.values(enumType).includes(value as T[keyof T]);
};

export default isEnumValue;
