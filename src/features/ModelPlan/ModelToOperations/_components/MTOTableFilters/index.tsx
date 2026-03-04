import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import CheckboxField from 'components/CheckboxField';

const MTOTableFilters = () => {
  const { t } = useTranslation('modelToOperationsMisc');
  const [filterNeededWithinThirtyDays, setFilterNeededWithinThirtyDays] =
    useState(false);
  const location = useLocation();
  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);
  const navigate = useNavigate();
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
          setFilterNeededWithinThirtyDays(!filterNeededWithinThirtyDays);
          params.set(
            'needed-within-thirty-days',
            filterNeededWithinThirtyDays ? 'true' : 'false'
          );
          params.set('page', '1');
          navigate({ search: params.toString() }, { replace: true });
        }}
      />
    </div>
  );
};

export default MTOTableFilters;
