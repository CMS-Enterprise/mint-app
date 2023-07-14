import React, { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  GridContainer,
  IconInfo,
  IconVisiblity,
  ModalRef
} from '@trussworks/react-uswds';

import Tooltip from 'components/shared/Tooltip';
import { ShareExportModalOpener } from 'components/ShareExport/modal';

import { filterGroups } from '../BodyContent/_filterGroupMapping';

import './index.scss';

type FilterViewBannerProps = {
  filteredView?: typeof filterGroups[number];
  openFilterModal: () => void;
  shareExportModalRef?: RefObject<ModalRef>;
};

const FilterViewBanner = ({
  filteredView,
  openFilterModal,
  shareExportModalRef
}: FilterViewBannerProps) => {
  const { t } = useTranslation('filterView');
  const { t: generalReadOnlyT } = useTranslation('generalReadOnly');

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
              {t('youAreViewing')} <strong>{filteredView ?? t('all')}</strong>{' '}
              {filteredView !== null ? t('information') : t('allInformation')}
            </div>
            {filteredView === null && (
              <Tooltip label={t('tooltip')} position="right">
                <IconInfo />
              </Tooltip>
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
                  onClick={() => history.push(`${history.location.pathname}`)}
                >
                  {t('clearFilter')}
                </Button>
              )}
              <Button type="button" onClick={openFilterModal}>
                {t('filterButton')}
              </Button>

              {shareExportModalRef && (
                <ShareExportModalOpener modalRef={shareExportModalRef}>
                  {generalReadOnlyT('shareExport')}
                </ShareExportModalOpener>
              )}
            </div>
          </div>
        </div>
      </GridContainer>
    </div>
  );
};

export default FilterViewBanner;
