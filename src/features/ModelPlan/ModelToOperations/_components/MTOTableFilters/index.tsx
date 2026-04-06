import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Checkbox, Select } from '@trussworks/react-uswds';

const FILTER_PARAM = 'needed-within-days';
const LEGACY_FILTER_PARAM = 'needed-within-thirty-days';
const HIDE_CATEGORY_ROWS_PARAM = 'hide-category-rows';

const DATE_PRESET_STRINGS: number[] = [30, 60, 90];

const selectValueFromSearchParams = (params: URLSearchParams): string => {
  if (params.get(LEGACY_FILTER_PARAM) === 'true') {
    return '30';
  }
  const paramValue = params.get(FILTER_PARAM);
  if (paramValue && DATE_PRESET_STRINGS.includes(Number(paramValue))) {
    return paramValue;
  }
  return 'all';
};

const hideCategoryRowsFromSearchParams = (params: URLSearchParams): boolean =>
  params.get(HIDE_CATEGORY_ROWS_PARAM) === 'true';

export type MTOTableFiltersProps = {
  /** Number of category and subcategory header rows hidden when the checkbox is checked. */
  categoryHeaderRowCount?: number;
};

/** Table filter controls for the MTO milestones matrix (date window + hide header rows). */
const MTOTableFilters = ({
  categoryHeaderRowCount = 0
}: MTOTableFiltersProps) => {
  const { t } = useTranslation('modelToOperationsMisc');
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const selectValue = selectValueFromSearchParams(params);
  const isTimeWindowFilterActive = selectValue !== 'all';

  const isHideCategoryRowsChecked = hideCategoryRowsFromSearchParams(params);

  const handleTimeWindowFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const next = new URLSearchParams(location.search);
    next.set('page', '1');
    next.delete(FILTER_PARAM);
    next.delete(LEGACY_FILTER_PARAM);
    next.delete(HIDE_CATEGORY_ROWS_PARAM);

    const { value } = e.target;
    if (DATE_PRESET_STRINGS.includes(Number(value))) {
      next.set(FILTER_PARAM, value);

      // Set hide category rows to true if time window filter is active
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

  // Syncs the initial `hide-category-rows` param with the `needed-within-days` param when the component mounts
  useEffect(() => {
    const next = new URLSearchParams(location.search);
    const hideCategoryRowsParam = next.get(HIDE_CATEGORY_ROWS_PARAM);

    if (hideCategoryRowsParam === null && isTimeWindowFilterActive) {
      next.set(HIDE_CATEGORY_ROWS_PARAM, 'true');
      navigate({ search: next.toString() }, { replace: true });
    }
  }, [isTimeWindowFilterActive, location.search, navigate]);

  return (
    <div
      className="margin-top-3 tablet:display-flex flex-align-center"
      style={{ gap: '1rem' }}
    >
      <p className="margin-y-0 text-bold">
        {t('table.tableFilters.tableFilters')}
      </p>
      <div className="display-flex flex-align-center" style={{ gap: '0.5rem' }}>
        <label
          className="usa-label margin-top-0 margin-bottom-0 text-normal"
          htmlFor="mto-needed-within-days"
        >
          {t('table.tableFilters.neededWithin')}
        </label>
        <Select
          className="margin-top-0 width-auto"
          id="mto-needed-within-days"
          data-testid="mto-needed-within-days"
          name={FILTER_PARAM}
          value={selectValue}
          onChange={handleTimeWindowFilterChange}
        >
          <option value="all">{t('table.tableFilters.neededWithinAll')}</option>
          {DATE_PRESET_STRINGS.map(days => (
            <option key={`needed-within-days--${days}`} value={days}>
              {t('table.tableFilters.neededWithinPresetDays', { days })}
            </option>
          ))}
        </Select>
      </div>
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
  );
};

export default MTOTableFilters;
