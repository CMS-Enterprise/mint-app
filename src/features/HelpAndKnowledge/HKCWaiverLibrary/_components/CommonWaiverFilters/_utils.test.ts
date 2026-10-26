import { CommonWaiverFilters } from 'features/HelpAndKnowledge/HKCWaiverLibrary/_components/WaivercardGroup';
import { CommonWaiverType } from 'gql/generated/graphql';
import { commonWaiversMockData } from 'tests/mock/general';

import {
  buildSearchParamsFromFilters,
  filterCommonWaivers,
  parseAppliedFilters,
  searchCommonWaivers
} from './_utils';

const emptyFilters: CommonWaiverFilters = {
  type: [],
  focus: [],
  other: []
};

describe('CommonWaiver Utils', () => {
  describe('parseAppliedFilters', () => {
    it('returns empty filters when no params are present', () => {
      const searchParams = new URLSearchParams('');
      const result = parseAppliedFilters(searchParams);

      expect(result).toEqual(emptyFilters);
    });

    it('parses valid url parameters into arrays', () => {
      const searchParams = new URLSearchParams(
        'type=MEDICAID_PAYMENT&focus=Focus 1,Focus 2'
      );
      const result = parseAppliedFilters(searchParams);

      expect(result.type).toEqual([CommonWaiverType.MEDICAID_PAYMENT]);
      expect(result.focus).toEqual(['Focus 1', 'Focus 2']);
      expect(result.other).toEqual([]);
    });
  });

  describe('buildSearchParamsFromFilters', () => {
    it('sets new params and joins arrays correctly', () => {
      const filters: CommonWaiverFilters = {
        ...emptyFilters,
        type: [CommonWaiverType.MEDICAID_PAYMENT],
        focus: ['Focus 1', 'Focus 2']
      };

      const params = buildSearchParamsFromFilters(
        filters,
        new URLSearchParams()
      );

      expect(params.get('type')).toBe(CommonWaiverType.MEDICAID_PAYMENT);
      expect(params.get('focus')).toBe('Focus 1,Focus 2');
      expect(params.get('other')).toBeNull();
    });

    it('deletes keys when filter arrays are empty', () => {
      const currentParams = new URLSearchParams(
        'type=OLD_TYPE&focus=OLD_FOCUS'
      );

      const params = buildSearchParamsFromFilters(emptyFilters, currentParams);

      expect(params.get('type')).toBeNull();
      expect(params.get('focus')).toBeNull();
    });

    it('removes the page parameter when filters are changed', () => {
      const currentParams = new URLSearchParams('page=3&type=OLD_TYPE');
      const params = buildSearchParamsFromFilters(emptyFilters, currentParams);

      expect(params.get('page')).toBeNull();
    });
  });

  describe('searchCommonWaivers', () => {
    it('returns all waivers if search query is empty', () => {
      expect(searchCommonWaivers('', commonWaiversMockData)).toEqual(
        commonWaiversMockData
      );
      expect(searchCommonWaivers('   ', commonWaiversMockData)).toEqual(
        commonWaiversMockData
      );
    });

    it('matches waivers by name (case-insensitive)', () => {
      const results = searchCommonWaivers('super', commonWaiversMockData);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('super long survey name Waiver 1');
    });

    it('matches waivers by description (case-insensitive)', () => {
      const results = searchCommonWaivers(
        'Description of Waiver 2',
        commonWaiversMockData
      );
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('short Waiver 2');
    });

    it('matches waivers by waiverType', () => {
      const results = searchCommonWaivers(
        'Medicaid waiver',
        commonWaiversMockData
      );
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('super long survey name Waiver 1');
    });
  });

  describe('filterCommonWaivers', () => {
    it('returns an empty array if no applied filters exist', () => {
      const results = filterCommonWaivers(emptyFilters, commonWaiversMockData);
      expect(results).toHaveLength(0);
    });

    it('filters by waiver type', () => {
      const filters = {
        ...emptyFilters,
        type: [CommonWaiverType.MEDICARE_PAYMENT]
      };
      const results = filterCommonWaivers(filters, commonWaiversMockData);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('short Waiver 2');
    });

    it('filters by focus area using SOME logic', () => {
      const filters = { ...emptyFilters, focus: ['Focus 1'] };
      const results = filterCommonWaivers(filters, commonWaiversMockData);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('super long survey name Waiver 1');
    });

    it('filters by WAIVERS_WITH_STANDARDIZATION_EFFORT_ONLY in other filters', () => {
      const filters = {
        ...emptyFilters,
        other: ['WAIVERS_WITH_STANDARDIZATION_EFFORT_ONLY']
      };
      const results = filterCommonWaivers(filters, commonWaiversMockData);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('super long survey name Waiver 1');
    });

    it('filters by WAIVERS_WITH_CLAIMS_DATA_OR_RREG_ONLY in other filters', () => {
      const filters = {
        ...emptyFilters,
        other: ['WAIVERS_WITH_CLAIMS_DATA_OR_RREG_ONLY']
      };
      const results = filterCommonWaivers(filters, commonWaiversMockData);

      expect(results).toHaveLength(2);
      expect(results.map(w => w.name)).toEqual([
        'super long survey name Waiver 1',
        'short Waiver 2'
      ]);
    });

    it('combines filter categories using OR logic', () => {
      const filters = {
        ...emptyFilters,
        type: [CommonWaiverType.PROGRAM_MEDICARE_BE],
        other: ['WAIVERS_WITH_STANDARDIZATION_EFFORT_ONLY']
      };
      const results = filterCommonWaivers(filters, commonWaiversMockData);

      expect(results).toHaveLength(2);
      expect(results.map(w => w.name)).toEqual([
        'super long survey name Waiver 1',
        'Waiver 3'
      ]);
    });
  });
});
