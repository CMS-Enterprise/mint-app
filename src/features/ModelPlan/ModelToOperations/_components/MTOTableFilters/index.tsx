import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import CheckboxField from 'components/CheckboxField';

const FILTER_PARAM = 'needed-within-thirty-days';

const MTOTableFilters = () => {
  const { t } = useTranslation('modelToOperationsMisc');
  const location = useLocation();
  const navigate = useNavigate();

  const isChecked =
    new URLSearchParams(location.search).get(FILTER_PARAM) === 'true';

  const handleChange = () => {
    const next = new URLSearchParams(location.search);
    next.set(FILTER_PARAM, isChecked ? 'false' : 'true');
    next.set('page', '1');
    navigate({ search: next.toString() }, { replace: true });
  };

  return (
    <div className="margin-top-3 display-flex" style={{ gap: '1rem' }}>
      <p className="margin-y-0 text-bold">
        {t('table.tableFilters.tableFilters')}
      </p>
      <CheckboxField
        noMargin
        id={FILTER_PARAM}
        name={FILTER_PARAM}
        label={t('table.tableFilters.neededWithinThirtyDays')}
        value={isChecked ? 'true' : 'false'}
        checked={isChecked}
        onBlur={() => null}
        onChange={handleChange}
      />
    </div>
  );
};

export default MTOTableFilters;
