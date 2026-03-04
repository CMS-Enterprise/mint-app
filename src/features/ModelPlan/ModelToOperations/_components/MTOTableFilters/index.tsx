import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import CheckboxField from 'components/CheckboxField';

const MTOTableFilters = () => {
  const { t } = useTranslation('modelToOperationsMisc');
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const navigate = useNavigate();
  const filterNeededWithinThirtyDays =
    params.get('needed-within-thirty-days') === 'true';

  return (
    <div className="margin-y-3 display-flex" style={{ gap: '1rem' }}>
      <p className="margin-y-0 text-bold">
        {t('table.tableFilters.tableFilters')}
      </p>
      <CheckboxField
        noMargin
        id="needed-within-thirty-days"
        name="needed-within-thirty-days"
        label={t('table.tableFilters.neededWithinThirtyDays')}
        value="false"
        checked={filterNeededWithinThirtyDays}
        onBlur={() => null}
        onChange={() => {
          const nextParams = new URLSearchParams(location.search);
          nextParams.set(
            'needed-within-thirty-days',
            !filterNeededWithinThirtyDays ? 'true' : 'false'
          );
          nextParams.set('page', '1');
          navigate({ search: nextParams.toString() }, { replace: true });
        }}
      />
    </div>
  );
};

export default MTOTableFilters;
