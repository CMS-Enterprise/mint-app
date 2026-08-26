import { DateTime } from 'luxon';

import { formatDateLocal } from 'utils/date';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

import {
  DATE_FILTER_PARAM,
  HIDE_CATEGORY_ROWS_PARAM,
  MTOTableSelectedFilters
} from '.';

export const getArrayFromParams = <T = string[]>(
  params: URLSearchParams,
  key: string
): T => {
  const value = params.get(key);
  return (value ? value.split(',') : []) as T;
};

export const parseAppliedFilters = (
  searchParams: URLSearchParams
): MTOTableSelectedFilters => {
  const dateRangeQuery = searchParams.get(DATE_FILTER_PARAM);
  const startDateQuery = searchParams.get('startDate');
  const endDateQuery = searchParams.get('endDate');

  let neededByDateRangeArray: string[] = [];
  if (dateRangeQuery) {
    neededByDateRangeArray = [dateRangeQuery];
  } else if (startDateQuery && endDateQuery) {
    neededByDateRangeArray = [startDateQuery, endDateQuery];
  }

  return {
    category: getArrayFromParams(searchParams, 'category'),
    role: getArrayFromParams<MTOTableSelectedFilters['role']>(
      searchParams,
      'role'
    ),
    neededByDateRange: neededByDateRangeArray,
    status: getArrayFromParams<MTOTableSelectedFilters['status']>(
      searchParams,
      'status'
    ),
    risk: getArrayFromParams<MTOTableSelectedFilters['risk']>(
      searchParams,
      'risk'
    ),
    other: getArrayFromParams(searchParams, 'other')
  };
};

export const buildSearchParamsFromFilters = (
  filters: MTOTableSelectedFilters,
  currentParams: URLSearchParams
): URLSearchParams => {
  const newParams = new URLSearchParams(currentParams);
  let hasAnyFilters = false;

  Object.entries(filters).forEach(([key, values]) => {
    if (key === 'neededByDateRange') {
      newParams.delete(DATE_FILTER_PARAM);
      newParams.delete('startDate');
      newParams.delete('endDate');

      if (values.length === 1) {
        newParams.set(DATE_FILTER_PARAM, values[0]);
        hasAnyFilters = true;
      } else if (values.length === 2) {
        const isValidStart = DateTime.fromISO(values[0]).isValid;
        const isValidEnd = DateTime.fromISO(values[1]).isValid;

        if (isValidStart && isValidEnd) {
          newParams.set('startDate', values[0]);
          newParams.set('endDate', values[1]);
          hasAnyFilters = true;
        }
      }
    } else if (values && values.length > 0) {
      newParams.set(convertCamelCaseToKebabCase(key), values.join(','));
      hasAnyFilters = true;
    } else {
      newParams.delete(convertCamelCaseToKebabCase(key));
    }
  });

  if (hasAnyFilters) {
    newParams.set(HIDE_CATEGORY_ROWS_PARAM, 'true');
  } else {
    newParams.delete(HIDE_CATEGORY_ROWS_PARAM);
  }

  // Reset pagination when filters change
  newParams.delete('page');

  return newParams;
};

export const countAppliedFilters = (
  filters: MTOTableSelectedFilters
): number => {
  return Object.entries(filters).reduce((totalCount, [key, filterArray]) => {
    const validItems = filterArray.filter(Boolean);

    if (validItems.length === 0) {
      return totalCount;
    }

    return totalCount + (key === 'neededByDateRange' ? 1 : validItems.length);
  }, 0);
};

// For date range filter, we want to display a single tag with the range.
export const transformFilterTagValues = (filters: MTOTableSelectedFilters) => {
  const transformedDateRange =
    filters.neededByDateRange.length === 2
      ? [
          `${formatDateLocal(filters.neededByDateRange[0], 'MM/dd/yyyy')} - ${formatDateLocal(filters.neededByDateRange[1], 'MM/dd/yyyy')}`
        ]
      : filters.neededByDateRange;

  return { ...filters, neededByDateRange: transformedDateRange };
};
