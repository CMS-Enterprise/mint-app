import { filterAndSortCTATData, isWithinRange } from '../useTest';

describe('CTAT report utils', () => {
  describe('isWithinRange', () => {
    it('returns true when date is within range', () => {
      const date = '2026-07-15T10:00:00Z';
      const range = {
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-07-31T23:59:59Z'
      };

      expect(isWithinRange(date, range)).toEqual(true);
    });

    it('returns false when date is before start date', () => {
      const date = '2026-06-15T10:00:00Z';
      const range = {
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-07-31T23:59:59Z'
      };

      expect(isWithinRange(date, range)).toEqual(false);
    });

    it('returns false when date is after end date', () => {
      const date = '2026-08-15T10:00:00Z';
      const range = {
        startDate: '2026-07-01T00:00:00Z',
        endDate: '2026-07-31T23:59:59Z'
      };

      expect(isWithinRange(date, range)).toEqual(false);
    });
  });

  describe('filterAndSortCTATData', () => {
    const mockData = [
      { id: '3', createdDts: '2026-07-20T10:00:00Z' },
      { id: '1', createdDts: '2026-07-10T10:00:00Z' },
      { id: '2', createdDts: '2026-07-15T10:00:00Z' }
    ];

    it('sorts data chronologically when no range is provided', () => {
      const expectedData = [
        { id: '1', createdDts: '2026-07-10T10:00:00Z' },
        { id: '2', createdDts: '2026-07-15T10:00:00Z' },
        { id: '3', createdDts: '2026-07-20T10:00:00Z' }
      ];

      expect(filterAndSortCTATData(mockData as any)).toEqual(expectedData);
    });

    it('filters out data outside the range and sorts chronologically', () => {
      const range = {
        startDate: '2026-07-12T00:00:00Z',
        endDate: '2026-07-18T23:59:59Z'
      };

      const expectedData = [{ id: '2', createdDts: '2026-07-15T10:00:00Z' }];

      expect(filterAndSortCTATData(mockData as any, range)).toEqual(
        expectedData
      );
    });
  });
});
