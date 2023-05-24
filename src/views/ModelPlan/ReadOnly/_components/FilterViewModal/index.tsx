import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Alert, Button, Link } from '@trussworks/react-uswds';

const FilterViewModal = () => {
  const { t } = useTranslation('filterView');

  return (
    <>
      <div className="filter-view__body padding-top-3 padding-bottom-4">
        <h3 className="margin-y-0">{t('group')}</h3>
        <p className="margin-y-0 font-body-sm text-base">{t('content')}</p>
        <Alert noIcon type="info">
          <p className="margin-y-0 font-body-sm text-bold">
            {t('alert.heading')}
          </p>
          <p className="margin-y-0 font-body-sm">
            <Trans i18nKey="filterView:alert.content">
              indexOne
              <Link href="mailto:MINTTeam@cms.hhs.gov">helpTextEmail</Link>
              indexTwo
            </Trans>
          </p>
        </Alert>
      </div>
      <div className="filter-view__footer margin-x-neg-4 border-top-1px border-base-lighter">
        <div className="padding-x-4 padding-top-2 display-flex flex-justify">
          <Button type="button" unstyled>
            {t('viewAll')}
          </Button>
          <Button type="button" disabled className="margin-x-0">
            {t('viewFiltered')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterViewModal;
