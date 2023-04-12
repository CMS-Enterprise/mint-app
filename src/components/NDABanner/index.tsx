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
  landing?: boolean;
  className?: string;
};

const NDABanner = ({ collapsable, landing, className }: NDABannerType) => {
  const { t } = useTranslation('nda');

  const HeadingLevel = React.createElement(
    landing ? 'h4' : 'h3',
    { className: 'margin-0' },
    t('header')
  );

  return (
    <SummaryBox
      heading=""
      className={classNames('padding-1 border-0', className)}
    >
      <MainContent>
        <GridContainer className={classNames({ 'padding-0': landing })}>
          <Grid desktop={{ col: 12 }}>
            <div className="display-flex padding-top-2">
              <IconInfo size={4} className="minw-4" />
              <div className="margin-left-105">
                {HeadingLevel}

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
