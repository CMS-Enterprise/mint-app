import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button, Checkbox, Icon, Select } from '@trussworks/react-uswds';
import {
  MtoFacilitator,
  MtoMilestoneStatus,
  MtoRiskIndicator,
  useGetMtoCategoriesQuery
} from 'gql/generated/graphql';

import FilterButtonWithModal from 'components/FilterButtonWithModal';
import FilterTags from 'components/FilterTags';
import PageLoading from 'components/PageLoading';
import GlobalClientFilter from 'components/TableFilter';
import { Tag } from 'components/Tag';
import { convertToUppercaseAndUnderscore } from 'utils/modelPlan';
import { tObject } from 'utils/translation';

import {
  buildSearchParamsFromFilters,
  countAppliedFilters,
  parseAppliedFilters,
  transformFilterTagValues
} from './_utils';
import getMTOTableFilters from './getMTOTableFilters';

export const DATE_FILTER_PARAM = 'needed-by-date-range';
export const HIDE_CATEGORY_ROWS_PARAM = 'hide-category-rows';
const DEFAULT_QUICK_FILTER_OPTION = 'ALL_TIME';

export type MTOTableFiltersProps = {
  /** Number of category and subcategory header rows hidden when the checkbox is checked. */
  categoryHeaderRowCount?: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

export type MTOTableSelectedFilters = {
  category: string[];
  role: MtoFacilitator[];
  neededByDateRange: string[];
  status: MtoMilestoneStatus[];
  risk: MtoRiskIndicator[];
  other: string[];
};

/** Table filter controls for the MTO milestones matrix (date window + hide header rows). */
const MTOTableFilters = ({
  categoryHeaderRowCount = 0,
  searchQuery,
  setSearchQuery
}: MTOTableFiltersProps) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const neededWithinDateOptionsConfig = tObject<string>(
    'modelToOperationsMisc:table.tableFilters.filterOptions.neededByDateRange.options'
  );

  const { modelID = '' } = useParams<{ modelID: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filtersTableOpen, setFiltersTableOpen] = useState(false);

  const quickDateFilterOptions = useMemo(() => {
    const presetOptions = Object.keys(neededWithinDateOptionsConfig).filter(
      value => value !== 'CUSTOM_DATE_RANGE'
    );

    return presetOptions.map(option => ({
      label: neededWithinDateOptionsConfig[option].toLowerCase(),
      value: convertToUppercaseAndUnderscore(option)
    }));
  }, [neededWithinDateOptionsConfig]);

  const appliedFilters = useMemo(
    () => parseAppliedFilters(searchParams),
    [searchParams]
  );

  const appliedFiltersCount = useMemo(
    () => countAppliedFilters(appliedFilters),
    [appliedFilters]
  );

  const setAppliedFilters = (filters: MTOTableSelectedFilters) => {
    const nextParams = buildSearchParamsFromFilters(filters, searchParams);
    setSearchParams(nextParams, { replace: true });
  };

  const isHideCategoryParamActive =
    searchParams.get(HIDE_CATEGORY_ROWS_PARAM) === 'true';

  const isHideCategoryRowsChecked =
    appliedFiltersCount > 0 || isHideCategoryParamActive;

  const selectValue =
    searchParams.get(DATE_FILTER_PARAM) || DEFAULT_QUICK_FILTER_OPTION;

  const { data: mtoCategoriesData, loading: mtoCategoriesLoading } =
    useGetMtoCategoriesQuery({
      variables: { id: modelID }
    });

  const mtoCategories = useMemo(
    () => mtoCategoriesData?.modelPlan?.mtoMatrix?.categories || [],
    [mtoCategoriesData]
  );

  const filterOptions = useMemo(
    () => getMTOTableFilters(mtoCategories),
    [mtoCategories]
  );

  /** Custom Date range requires these transforming.
   * it needs to be displayed as startDate=MM/DD/YYYY&endDate=MM/DD/YYYY in the URL,
   * but displayed as MM/DD/YYYY - MM/DD/YYYY in the filter tag.
   * When none date range filter is clicked, we feed the original data back to setAppliedFilters to rebuild params correctly,
   * otherwise the URL will be set with MM/DD/YYYY - MM/DD/YYYY.
   */
  const appliedFilterTags = useMemo(
    () => transformFilterTagValues(appliedFilters),
    [appliedFilters]
  );

  const handleFilterTagsChange = (updatedTags: MTOTableSelectedFilters) => {
    setAppliedFilters({
      ...updatedTags,
      neededByDateRange:
        updatedTags.neededByDateRange.length === 0
          ? []
          : appliedFilters.neededByDateRange
    });
  };

  const handleTimeWindowFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set('page', '1');
    nextParams.delete('startDate');
    nextParams.delete('endDate');

    const { value } = e.target;

    if (value === DEFAULT_QUICK_FILTER_OPTION) {
      nextParams.delete(DATE_FILTER_PARAM);
      nextParams.delete(HIDE_CATEGORY_ROWS_PARAM);
    }

    if (value !== DEFAULT_QUICK_FILTER_OPTION) {
      nextParams.set(DATE_FILTER_PARAM, convertToUppercaseAndUnderscore(value));
      nextParams.set(HIDE_CATEGORY_ROWS_PARAM, 'true');
    }

    setSearchParams(nextParams, { replace: true });
  };

  const handleHideCategoryRowsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set('page', '1');
    nextParams.set(
      HIDE_CATEGORY_ROWS_PARAM,
      e.target.checked ? 'true' : 'false'
    );
    setSearchParams(nextParams, { replace: true });
  };

  useEffect(() => {
    if (appliedFiltersCount > 0 || isHideCategoryParamActive) {
      setFiltersTableOpen(true);
    }
  }, [appliedFiltersCount, isHideCategoryParamActive]);

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
              style={{ minWidth: '12rem' }}
              data-testid="mto-needed-within-days"
              name={DATE_FILTER_PARAM}
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
            disabled={appliedFiltersCount > 0}
            checked={isHideCategoryRowsChecked}
            onChange={handleHideCategoryRowsChange}
          />
        </div>
      )}

      <GlobalClientFilter
        className="margin-bottom-4 maxw-none width-mobile-lg"
        tableID={t('table.tableFilters.tableFilters')}
        tableName={t('table.tableFilters.tableFilters')}
        globalFilter={searchQuery}
        setGlobalFilter={setSearchQuery}
      />

      {filtersTableOpen && (
        <FilterTags
          filters={filterOptions}
          appliedFilters={appliedFilterTags}
          setAppliedFilters={handleFilterTagsChange}
          className="margin-top-2"
        />
      )}
    </div>
  );
};

export default MTOTableFilters;
