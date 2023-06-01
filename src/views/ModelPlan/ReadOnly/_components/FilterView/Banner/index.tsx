import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer } from '@trussworks/react-uswds';

const FilterViewBanner = ({ filteredView }: { filteredView: string }) => {
  const { t } = useTranslation('filterView');
  return (
    <div className="position-sticky z-100 top-0 bg-primary-darker text-white padding-105">
      <GridContainer>
        {t('youAreViewing')} <strong>{filteredView}</strong> {t('information')}
      </GridContainer>
    </div>
  );
};

export default FilterViewBanner;
