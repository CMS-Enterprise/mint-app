import { MtoMilestoneStatus } from 'gql/generated/graphql';

import {
  buildSearchParamsFromFilters,
  countAppliedFilters,
  getArrayFromParams,
  parseAppliedFilters,
  transformFilterTagValues
} from './_utils';
import {
  DATE_FILTER_PARAM,
  HIDE_CATEGORY_ROWS_PARAM,
  MTOTableSelectedFilters
} from '.';

const emptyFilters: MTOTableSelectedFilters = {
  category: [],
  role: [],
  neededByDateRange: [],
  status: [],
  risk: [],
  other: []
};

describe('MTOTableFilters Utils', () => {
  describe('getArrayFromParams', () => {
    it('returns an empty array if parameter does not exist', () => {
      const params = new URLSearchParams('');
      expect(getArrayFromParams(params, 'category')).toEqual([]);
    });

    it('returns single item array when param has one value', () => {
      const params = new URLSearchParams('category=FINANCE');
      expect(getArrayFromParams(params, 'category')).toEqual(['FINANCE']);
    });

    it('splits comma-separated values into an array', () => {
      const params = new URLSearchParams('category=FINANCE,LEGAL,OPS');
      expect(getArrayFromParams(params, 'category')).toEqual([
        'FINANCE',
        'LEGAL',
        'OPS'
      ]);
    });
  });

  describe('parseAppliedFilters', () => {
    it('returns empty filter structures when search params are empty', () => {
      const searchParams = new URLSearchParams('');
      const result = parseAppliedFilters(searchParams);

      expect(result).toEqual(emptyFilters);
    });

    it('correctly parses comma-separated filter params', () => {
      const searchParams = new URLSearchParams(
        'category=CAT_1,CAT_2&status=IN_PROGRESS&risk=HIGH'
      );
      const result = parseAppliedFilters(searchParams);

      expect(result.category).toEqual(['CAT_1', 'CAT_2']);
      expect(result.status).toEqual(['IN_PROGRESS']);
      expect(result.risk).toEqual(['HIGH']);
    });

    it('parses preset date range option', () => {
      const searchParams = new URLSearchParams(
        `${DATE_FILTER_PARAM}=NEXT_30_DAYS`
      );
      const result = parseAppliedFilters(searchParams);

      expect(result.neededByDateRange).toEqual(['NEXT_30_DAYS']);
    });

    it('parses custom start and end dates into array', () => {
      const searchParams = new URLSearchParams(
        'startDate=2026-01-01&endDate=2026-02-01'
      );
      const result = parseAppliedFilters(searchParams);

      expect(result.neededByDateRange).toEqual(['2026-01-01', '2026-02-01']);
    });
  });

  describe('buildSearchParamsFromFilters', () => {
    it('serializes standard category and role filters into kebab-case params', () => {
      const filters: MTOTableSelectedFilters = {
        ...emptyFilters,
        category: ['CAT_1', 'CAT_2'],
        role: ['FACILITATOR' as any]
      };

      const params = buildSearchParamsFromFilters(
        filters,
        new URLSearchParams()
      );

      expect(params.get('category')).toBe('CAT_1,CAT_2');
      expect(params.get('role')).toBe('FACILITATOR');
      expect(params.get(HIDE_CATEGORY_ROWS_PARAM)).toBe('true');
    });

    it('handles preset date range filter correctly', () => {
      const filters: MTOTableSelectedFilters = {
        ...emptyFilters,
        neededByDateRange: ['NEXT_30_DAYS']
      };

      const params = buildSearchParamsFromFilters(
        filters,
        new URLSearchParams()
      );

      expect(params.get(DATE_FILTER_PARAM)).toBe('NEXT_30_DAYS');
      expect(params.get('startDate')).toBeNull();
      expect(params.get('endDate')).toBeNull();
    });

    it('handles valid custom ISO date range correctly', () => {
      const filters: MTOTableSelectedFilters = {
        ...emptyFilters,
        neededByDateRange: ['2026-07-01', '2026-08-01']
      };

      const params = buildSearchParamsFromFilters(
        filters,
        new URLSearchParams()
      );

      expect(params.get(DATE_FILTER_PARAM)).toBeNull();
      expect(params.get('startDate')).toBe('2026-07-01');
      expect(params.get('endDate')).toBe('2026-08-01');
    });

    it('ignores invalid custom date strings', () => {
      const filters: MTOTableSelectedFilters = {
        ...emptyFilters,
        neededByDateRange: ['invalid-date', '2026-08-01']
      };

      const params = buildSearchParamsFromFilters(
        filters,
        new URLSearchParams()
      );

      expect(params.get('startDate')).toBeNull();
      expect(params.get('endDate')).toBeNull();
    });

    it('resets page param and removes hide-category-rows when no filters remain', () => {
      const currentParams = new URLSearchParams(
        `page=3&${HIDE_CATEGORY_ROWS_PARAM}=true&category=OLD`
      );

      const params = buildSearchParamsFromFilters(emptyFilters, currentParams);

      expect(params.get('page')).toBeNull();
      expect(params.get('category')).toBeNull();
      expect(params.get(HIDE_CATEGORY_ROWS_PARAM)).toBeNull();
    });
  });

  describe('countAppliedFilters', () => {
    it('returns 0 when no filters are selected', () => {
      expect(countAppliedFilters(emptyFilters)).toBe(0);
    });

    it('counts individual items across different categories', () => {
      const filters: MTOTableSelectedFilters = {
        ...emptyFilters,
        category: ['CAT_1', 'CAT_2'],
        status: ['IN_PROGRESS' as any]
      };

      expect(countAppliedFilters(filters)).toBe(3);
    });

    it('counts date range as 1 total filter regardless of start and end date count', () => {
      const presetDateFilter: MTOTableSelectedFilters = {
        ...emptyFilters,
        neededByDateRange: ['NEXT_30_DAYS']
      };

      const customDateFilter: MTOTableSelectedFilters = {
        ...emptyFilters,
        neededByDateRange: ['2026-01-01', '2026-02-01']
      };

      expect(countAppliedFilters(presetDateFilter)).toBe(1);
      expect(countAppliedFilters(customDateFilter)).toBe(1);
    });

    it('ignores empty string entries', () => {
      const filters: MTOTableSelectedFilters = {
        ...emptyFilters,
        category: ['CAT_1', '']
      };

      expect(countAppliedFilters(filters)).toBe(1);
    });
  });

  describe('transformFilterTagValues', () => {
    it('transforms an array of two dates into a single formatted date range string', () => {
      const mockFilters = {
        status: [MtoMilestoneStatus.IN_PROGRESS],
        neededByDateRange: ['2026-08-01', '2026-09-01'],
        category: [],
        role: [],
        risk: [],
        other: []
      };

      const result = transformFilterTagValues(mockFilters);

      expect(result).toEqual({
        status: [MtoMilestoneStatus.IN_PROGRESS],
        neededByDateRange: ['08/01/2026 - 09/01/2026'],
        category: [],
        role: [],
        risk: [],
        other: []
      });
    });

    it('returns neededByDateRange unchanged when given an empty array', () => {
      const mockFilters = {
        status: [MtoMilestoneStatus.COMPLETED],
        neededByDateRange: [],
        category: [],
        role: [],
        risk: [],
        other: []
      };

      const result = transformFilterTagValues(mockFilters);

      expect(result).toEqual({
        status: [MtoMilestoneStatus.COMPLETED],
        neededByDateRange: [],
        category: [],
        role: [],
        risk: [],
        other: []
      });
    });

    it('returns neededByDateRange unchanged if array length is not 2', () => {
      const mockFiltersWithOneDate = {
        neededByDateRange: ['Next 30 days'],
        status: [],
        category: [],
        role: [],
        risk: [],
        other: []
      };

      const result = transformFilterTagValues(mockFiltersWithOneDate);

      expect(result.neededByDateRange).toEqual(['Next 30 days']);
    });

    it('preserves all other properties in the filters object', () => {
      const mockFilters = {
        category: [],
        status: [MtoMilestoneStatus.COMPLETED],
        neededByDateRange: ['2026-01-01', '2026-01-02'],
        role: [],
        risk: [],
        other: []
      };

      const result = transformFilterTagValues(mockFilters);

      expect(result).toHaveProperty('category', []);
      expect(result).toHaveProperty('status', [MtoMilestoneStatus.COMPLETED]);
    });
  });
});
