import React from 'react';
import { useTranslation } from 'react-i18next';

import CheckboxField from 'components/CheckboxField';

const MTOTableFilters = () => {
  const { t } = useTranslation('modelToOperationsMisc');
  return (
    <div className="margin-y-3 display-flex ">
      <p className="margin-y-0 text-bold">
        {t('table.tableFilters.tableFilters')}
      </p>
      <CheckboxField
        noMargin
        id="hide-added-solutions"
        name="hide-added-solutions"
        label={t('table.tableFilters.neededWithinThirtyDays')}
        value="true"
        checked={false}
        onBlur={() => null}
        // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        //   console.log(e);
        // }}
        // label={t('solutionLibrary.hideAdded', {
        //   count: addedSolutions.length
        // })}
        // value="true"
        // checked={hideAddedSolutions}
        // onBlur={() => null}
        // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        //   params.set(
        //     'hide-added-solutions',
        //     hideAddedSolutions ? 'false' : 'true'
        //   );
        //   params.set('page', '1');
        //   navigate({ search: params.toString() }, { replace: true });
        // }}
      />
    </div>
  );
};

export default MTOTableFilters;
