import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid, GridContainer, Link } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import NDABanner from 'components/NDABanner';

import './index.scss';

export type FooterItemType = {
  heading: string;
  description: string;
};

export const LandingHeader = () => {
  const { t } = useTranslation('landing');

  return (
    <div className="landing bg-primary-darker text-white">
      <GridContainer className="padding-top-2">
        <h1 className="landing__heading">{t('heading')}</h1>

        <p className="landing__description">{t('description')}</p>

        <UswdsReactLink
          className="usa-button bg-mint-cool-vivid text-white"
          variant="unstyled"
          to="/signin"
        >
          {t('signIn')}
        </UswdsReactLink>

        <NDABanner
          className="bg-primary-darker text-white padding-x-0 border-top border-primary-dark margin-top-6"
          landing
        />
      </GridContainer>
    </div>
  );
};

export const LandingBody = () => {
  const { t } = useTranslation('landing');

  return (
    <GridContainer className="padding-top-2">
      <p className="text-bold landing__description">{t('bodyHeading')}</p>
    </GridContainer>
  );
};

export const LandingFooter = () => {
  const { t } = useTranslation('landing');

  const footerItems: FooterItemType[] = t('footerItems', {
    returnObjects: true
  });

  return (
    <div className="landing bg-mint-cool-5 margin-bottom-neg-7">
      <GridContainer className="padding-top-6 padding-bottom-4">
        <h2 className="margin-bottom-2 margin-top-0">{t('heading')}</h2>

        <Grid row gap>
          {footerItems.map(item => (
            <Grid tablet={{ col: 4 }}>
              <h3 className="margin-bottom-0">{item.heading}</h3>
              <p className="margin-top-1 line-height-mono-4">
                {item.description}
              </p>
            </Grid>
          ))}
        </Grid>

        <div className="display-flex landing__footer padding-top-2">
          <p className="text-bold margin-right-1">{t('access')}</p>
          <p>
            <Trans i18nKey="landing:email">
              indexOne
              <Link href="mailto:MINTTeam@cms.hhs.gov">helpTextEmail</Link>
              indexTwo
            </Trans>
          </p>
        </div>
      </GridContainer>
    </div>
  );
};

export const Landing = () => {
  return (
    <div>
      <LandingHeader />
      <LandingBody />
      <LandingFooter />
    </div>
  );
};

export default Landing;
