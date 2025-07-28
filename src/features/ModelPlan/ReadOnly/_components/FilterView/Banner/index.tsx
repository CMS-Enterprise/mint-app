import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, GridContainer, Icon } from '@trussworks/react-uswds';

import Tooltip from 'components/Tooltip';

import { filterGroups } from '../BodyContent/_filterGroupMapping';

import './index.scss';

type FilterViewBannerProps = {
  filteredView?: (typeof filterGroups)[number] | null;
  openFilterModal: () => void;
  openExportModal: () => void;
};

const FilterViewBanner = ({
  filteredView,
  openFilterModal,
  openExportModal
}: FilterViewBannerProps) => {
  const { t } = useTranslation('filterView');
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');

  const navigate = useNavigate();

  return (
    <div
      className="position-sticky z-100 bg-primary-darker text-white padding-105 group-filter-banner"
      data-testid="group-filter-banner"
    >
      <GridContainer>
        <div className="banner display-flex flex-justify">
          <div
            className="display-flex flex-align-center"
            style={{ gap: '1rem' }}
          >
            <Icon.Visibility size={3} aria-label="visibility" />
            <div>
              {t('youAreViewing')} <strong>{filteredView ?? t('all')}</strong>{' '}
              {filteredView !== null ? t('information') : t('allInformation')}
            </div>
            {filteredView === null && (
              <div className="mint-no-print">
                <Tooltip label={t('tooltip')} position="right">
                  <Icon.Info aria-label="info" />
                </Tooltip>
              </div>
            )}
          </div>
          <div className="mint-no-print">
            <div
              className="display-flex flex-justify flex-align-center flex-align-self-end"
              style={{ gap: '1rem' }}
            >
              {filteredView && (
                <Button
                  type="button"
                  unstyled
                  className="text-white text-no-wrap"
                  onClick={() => navigate(`${window.location.pathname}`)}
                >
                  {t('clearFilter')}
                </Button>
              )}
              <Button type="button" onClick={openFilterModal}>
                {t('filterButton')}
              </Button>

              <Button
                type="button"
                className="usa-button--outline text-white shadow-none border-white border-2px"
                onClick={openExportModal}
              >
                {generalReadOnlyT('shareExport')}
              </Button>
            </div>
          </div>
        </div>
      </GridContainer>
    </div>
  );
};

export default FilterViewBanner;
