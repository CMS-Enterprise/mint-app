import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, GridContainer, IconVisiblity } from '@trussworks/react-uswds';

import './index.scss';

type FilterViewBannerProps = {
  filteredView: string;
  openFilterModal: () => void;
};

const FilterViewBanner = ({
  filteredView,
  openFilterModal
}: FilterViewBannerProps) => {
  const { t } = useTranslation('filterView');
  const history = useHistory();
  return (
    <div
      className="position-sticky z-100 top-0 bg-primary-darker text-white padding-105"
      data-testid="group-filter-banner"
    >
      <GridContainer>
        <div className="banner display-flex flex-justify">
          <div
            className="display-flex flex-align-center"
            style={{ gap: '1rem' }}
          >
            <IconVisiblity size={3} />
            <div>
              {t('youAreViewing')} <strong>{filteredView}</strong>{' '}
              {t('information')}
            </div>
          </div>
          <div
            className="display-flex flex-justify flex-align-center flex-align-self-end"
            style={{ gap: '1rem' }}
          >
            <Button
              type="button"
              unstyled
              className="text-white text-no-wrap"
              onClick={() => history.push(`${history.location.pathname}`)}
            >
              {t('clearFilter')}
            </Button>
            <Button type="button" onClick={openFilterModal}>
              {t('filterButton')}
            </Button>
          </div>
        </div>
      </GridContainer>
    </div>
  );
};

export default FilterViewBanner;
