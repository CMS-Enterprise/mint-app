import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  Icon,
  SummaryBox,
  SummaryBoxContent
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
    { className: 'margin-0 margin-bottom-1' },
    t('header')
  );

  return (
    <SummaryBox
      className={classNames(
        'padding-x-0 padding-bottom-2 padding-top-105 border-0',
        className
      )}
    >
      <SummaryBoxContent>
        <MainContent>
          <GridContainer className={classNames({ 'padding-0': landing })}>
            <Grid desktop={{ col: 12 }}>
              <div className="display-flex">
                <Icon.Info size={4} className="minw-4" />
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
                      childClassName="margin-y-0 padding-y-0"
                    >
                      <p className="margin-top-0 margin-bottom-1">
                        <span className="text-bold">{t('caveat')}</span>{' '}
                        <span>{t('body')}</span>
                      </p>
                    </CollapsableLink>
                  ) : (
                    <p>
                      <span className="text-bold">{t('caveat')}</span>{' '}
                      <span>{t('body')}</span>
                    </p>
                  )}
                </div>
              </div>
            </Grid>
          </GridContainer>
        </MainContent>
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default NDABanner;
