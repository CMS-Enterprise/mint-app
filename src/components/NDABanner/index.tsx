import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  IconInfo,
  SummaryBox
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import MainContent from 'components/MainContent';
import CollapsableLink from 'components/shared/CollapsableLink';

type NDABannerType = {
  collapsable?: boolean;
  className?: string;
};

const NDABanner = ({ collapsable, className }: NDABannerType) => {
  const { t } = useTranslation('nda');

  return (
    <SummaryBox
      heading=""
      className={classNames(className, 'padding-1 border-0')}
    >
      <MainContent>
        <GridContainer>
          <Grid desktop={{ col: 12 }}>
            <div className="display-flex padding-top-2">
              <IconInfo size={4} className="minw-4" />
              <div className="margin-left-105">
                <h3 className="margin-0">{t('header')}</h3>

                {collapsable ? (
                  <CollapsableLink
                    id="pre-decisional-collapse"
                    label={t('readMore')}
                    closeLabel={t('readLess')}
                    labelPosition="bottom"
                    styleLeftBar={false}
                    iconPosition="left"
                    className="margin-bottom-2"
                  >
                    <p className="padding-0 margin-0">{t('body')}</p>
                  </CollapsableLink>
                ) : (
                  <p>{t('body')}</p>
                )}
              </div>
            </div>
          </Grid>
        </GridContainer>
      </MainContent>
    </SummaryBox>
  );
};

export default NDABanner;
