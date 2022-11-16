import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import HelpCardGroup from '../_components/HelpCardGroup';

const GettingStarted = () => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <MainContent>
      <GridContainer>
        <Grid>
          <HelpBreadcrumb text={t('gettingStarted')} />
          <PageHeading className="margin-bottom-1">
            {t('gettingStarted')}
          </PageHeading>
          <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-6">
            {t('gettingStartedInstructions')}
          </p>
          <HelpCardGroup className="margin-y-2" filter="gettingStarted" />
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default GettingStarted;
