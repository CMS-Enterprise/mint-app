import { symmetricDifference } from 'utils/formUtil';

describe('symmetricDifference', () => {
  it('return symmetrical differences between two arrays', () => {
    expect(symmetricDifference([1, 2, 3], [5, 3])).toEqual([1, 2, 5]);

    expect(symmetricDifference([], [5, 3])).toEqual([5, 3]);

    expect(symmetricDifference([], [])).toEqual([]);

    expect(symmetricDifference([1, 2, 3], ['5', '3'])).toEqual([
      1,
      2,
      3,
      '5',
      '3'
    ]);
  });
});
