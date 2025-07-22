import isEnumValue from 'utils/enum';

enum TestEnum {
  foo = 'foo',
  bar = 'bar'
}
describe('enum realted utils', () => {
  it('should return true if a value belongs to given enum type', () => {
    expect(isEnumValue(TestEnum, 'bar')).toEqual(true);
    expect(isEnumValue(TestEnum, 'mto')).toEqual(false);
    expect(isEnumValue(TestEnum, undefined)).toEqual(false);
    expect(isEnumValue(TestEnum, null)).toEqual(false);
  });
});
