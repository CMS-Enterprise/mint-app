import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Select } from '@trussworks/react-uswds';

const FILTER_PARAM = 'needed-within-days';
const LEGACY_FILTER_PARAM = 'needed-within-thirty-days';

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

const MTOTableFilters = () => {
  const { t } = useTranslation('modelToOperationsMisc');
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const selectValue = selectValueFromSearchParams(params);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(location.search);
    next.set('page', '1');
    next.delete(FILTER_PARAM);
    next.delete(LEGACY_FILTER_PARAM);

    const { value } = e.target;
    if (DATE_PRESET_STRINGS.includes(Number(value))) {
      next.set(FILTER_PARAM, value);
    }

    navigate({ search: next.toString() }, { replace: true });
  };

  return (
    <div
      className="margin-top-3 display-flex flex-align-center"
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
          onChange={handleChange}
        >
          <option value="all">{t('table.tableFilters.neededWithinAll')}</option>
          {DATE_PRESET_STRINGS.map(days => (
            <option key={`needed-within-days--${days}`} value={days}>
              {t('table.tableFilters.neededWithinPresetDays', { days })}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default MTOTableFilters;
