import globalTableFilter from './globalTableFilter';

const rows = [
  {
    values: {
      name: 'John',
      date: '2022-02-01T05:00:00.000-05:00',
      number: 5
    }
  },
  {
    values: {
      name: 'Mary',
      date: '2022-02-02T05:00:00.000-05:00',
      number: 0
    }
  },
  {
    values: {
      name: 'Beth',
      date: '2022-02-03T05:00:00.000-05:00',
      number: 12
    }
  }
] as any;

describe('globalTableFilter', () => {
  it('return matching rows', () => {
    expect(globalTableFilter(rows, [''], 'John')).toEqual([rows[0]]);
    expect(globalTableFilter(rows, [''], '2022-02-02')).toEqual([rows[1]]);
    expect(globalTableFilter(rows, [''], '12')).toEqual([rows[2]]);
    expect(globalTableFilter(rows, [''], '2022')).toEqual(rows);
  });
});
