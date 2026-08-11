import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Checkbox, Icon, Select } from '@trussworks/react-uswds';
import {
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  useGetMtoCategoriesQuery
} from 'gql/generated/graphql';

import FilterButtonWithModal from 'components/FilterButtonWithModal';
import PageLoading from 'components/PageLoading';
import { Tag } from 'components/Tag';
import { convertToUppercaseAndUnderscore } from 'utils/modelPlan';
import { tObject } from 'utils/translation';

import MTOTableDateFilter from '../MTOTableDateFilter';

import getMTOTableFilters from './getMTOTableFilters';

export const QUICK_FILTER_PARAM = 'needed-by-date-range';
const HIDE_CATEGORY_ROWS_PARAM = 'hide-category-rows';
const DEFAULT_QUICK_FILTER_OPTION = 'ALL_TIME';

const hideCategoryRowsFromSearchParams = (params: URLSearchParams): boolean =>
  params.get(HIDE_CATEGORY_ROWS_PARAM) === 'true';

export type MTOTableFiltersProps = {
  /** Number of category and subcategory header rows hidden when the checkbox is checked. */
  categoryHeaderRowCount?: number;
};

type MTOTableSelectedFilters = {
  category: string[];
  role: MtoFacilitator[];
  neededByDate: string[];
  status: MtoMilestoneStatus[];
  risk: MtoRiskIndicator[];
  other: string[];
};

/** Table filter controls for the MTO milestones matrix (date window + hide header rows). */
const MTOTableFilters = ({
  categoryHeaderRowCount = 0
}: MTOTableFiltersProps) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const neededWithinDateOptionsConfig = tObject<string>(
    'modelToOperationsMisc:table.tableFilters.filterOptions.neededByDateRange.options'
  );

  const { modelID = '' } = useParams<{ modelID: string }>();

  const location = useLocation();
  const navigate = useNavigate();

  const [filtersTableOpen, setFiltersTableOpen] = useState(false);

  const params = new URLSearchParams(location.search);

  const selectValue =
    params.get(QUICK_FILTER_PARAM) || DEFAULT_QUICK_FILTER_OPTION;

  const isTimeWindowFilterActive =
    selectValue !== null && selectValue !== DEFAULT_QUICK_FILTER_OPTION;

  const isHideCategoryRowsChecked =
    isTimeWindowFilterActive || hideCategoryRowsFromSearchParams(params);

  const quickDateFilterOptions = useMemo(() => {
    const presetOptions = Object.keys(neededWithinDateOptionsConfig).filter(
      value => value !== 'customDateRange'
    );

    return presetOptions.map(option => ({
      label: neededWithinDateOptionsConfig[option].toLowerCase(),
      value: convertToUppercaseAndUnderscore(option)
    }));
  }, [neededWithinDateOptionsConfig]);

  const appliedFilters: MTOTableSelectedFilters = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    function getArray<T = string[]>(key: string): T {
      return (searchParams.get(key)?.split(',') || []) as T;
    }

    return {
      category: getArray('category'),
      role: getArray<MTOTableSelectedFilters['role']>('role'),
      neededByDate: getArray('neededByDate'),
      status: getArray<MTOTableSelectedFilters['status']>('status'),
      risk: getArray<MTOTableSelectedFilters['risk']>('risk'),
      other: getArray('other')
    };
  }, [location.search]);

  const setAppliedFilters = (filters: MTOTableSelectedFilters) => {
    const newParams = new URLSearchParams(location.search);

    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        newParams.set(key, values.join(','));
      } else {
        newParams.delete(key);
      }
    });
    // Reset pagination when filters change
    newParams.delete('page');

    navigate({ search: newParams.toString() }, { replace: true });
  };

  const appliedFiltersCount = useMemo(() => {
    return Object.values(appliedFilters).reduce((totalCount, filterArray) => {
      const validItems = filterArray.filter(Boolean);
      return totalCount + validItems.length;
    }, 0);
  }, [appliedFilters]);

  const { data: mtoCategoriesData, loading: mtoCategoriesLoading } =
    useGetMtoCategoriesQuery({
      variables: { id: modelID }
    });

  const handleTimeWindowFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const next = new URLSearchParams(location.search);
    next.set('page', '1');

    const { value } = e.target;

    if (value === DEFAULT_QUICK_FILTER_OPTION) {
      next.delete(QUICK_FILTER_PARAM);
      next.delete(HIDE_CATEGORY_ROWS_PARAM);
    }

    if (value !== DEFAULT_QUICK_FILTER_OPTION) {
      next.set(QUICK_FILTER_PARAM, convertToUppercaseAndUnderscore(value));
      next.set(HIDE_CATEGORY_ROWS_PARAM, 'true');
    }

    navigate({ search: next.toString() }, { replace: true });
  };

  const handleHideCategoryRowsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const next = new URLSearchParams(location.search);
    next.set('page', '1');
    next.set(HIDE_CATEGORY_ROWS_PARAM, e.target.checked ? 'true' : 'false');
    navigate({ search: next.toString() }, { replace: true });
  };

  const mtoCategories = useMemo(
    () => mtoCategoriesData?.modelPlan?.mtoMatrix?.categories || [],
    [mtoCategoriesData]
  );

  const filterOptions = useMemo(
    () => getMTOTableFilters(mtoCategories, <MTOTableDateFilter />),
    [mtoCategories]
  );

  useEffect(() => {
    if (
      appliedFiltersCount !== 0 ||
      isTimeWindowFilterActive ||
      isHideCategoryRowsChecked
    ) {
      setFiltersTableOpen(true);
    }
  }, [
    appliedFiltersCount,
    isTimeWindowFilterActive,
    isHideCategoryRowsChecked
  ]);

  if (mtoCategoriesLoading) {
    return <PageLoading testId="mto-table-filters" />;
  }

  return (
    <div className="border-1px radius-md border-gray-10 padding-3 margin-bottom-1">
      <div className="display-flex margin-bottom-3 flex-justify flex-align-center">
        <div className="display-flex flex-align-center">
          <p className="margin-y-0 text-bold">
            {t('table.tableFilters.tableFilters')}
          </p>

          <div className="margin-x-2 border-left-2px border-base-light height-2" />

          <Button
            type="button"
            unstyled
            onClick={() => setFiltersTableOpen(!filtersTableOpen)}
          >
            {filtersTableOpen ? (
              <>
                {t('table.tableFilters.hideFilters')}
                <Icon.ExpandLess aria-label="collapse" />
              </>
            ) : (
              <>
                {t('table.tableFilters.showFilters')}
                <Icon.ExpandMore aria-label="expand" />
              </>
            )}
          </Button>
        </div>

        <Tag className="bg-primary-lighter radius-lg padding-y-1 padding-x-2 margin-0 text-bold">
          {t('table.tableFilters.numberOfFiltersApplied', {
            number: appliedFiltersCount
          })}
        </Tag>
      </div>

      {filtersTableOpen && (
        <div
          className="display-flex flex-align-center margin-bottom-3 maxh-5"
          style={{ gap: '1.5rem' }}
        >
          <FilterButtonWithModal
            filters={filterOptions}
            appliedFilters={appliedFilters}
            setAppliedFilters={setAppliedFilters}
          />

          <p className="margin-y-0 text-bold line-height-sans-2">
            {t('table.tableFilters.quickFilters')}
          </p>

          <div
            className="display-flex flex-align-center"
            style={{ gap: '0.5rem' }}
          >
            <label
              className="usa-label margin-top-0 margin-bottom-0 text-normal"
              htmlFor="mto-needed-within-days"
              style={{ whiteSpace: 'nowrap' }}
            >
              {t('table.tableFilters.neededWithin')}
            </label>
            <Select
              className="margin-top-0"
              id="mto-needed-within-days"
              data-testid="mto-needed-within-days"
              name={QUICK_FILTER_PARAM}
              value={selectValue}
              onChange={handleTimeWindowFilterChange}
            >
              {quickDateFilterOptions.map(({ value, label }) => (
                <option key={`needed-within-days-${value}`} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div className="border-left-2px border-base-light margin-x-1 height-2" />

          <Checkbox
            id="mto-hide-category-rows"
            className="margin-bottom-1"
            data-testid="mto-hide-category-rows"
            name={HIDE_CATEGORY_ROWS_PARAM}
            label={t('table.tableFilters.hideCategoryRows', {
              count: categoryHeaderRowCount
            })}
            disabled={isTimeWindowFilterActive}
            checked={isHideCategoryRowsChecked}
            onChange={handleHideCategoryRowsChange}
          />
        </div>
      )}

      <div>Place holder for search bar</div>
    </div>
  );
};

export default MTOTableFilters;
