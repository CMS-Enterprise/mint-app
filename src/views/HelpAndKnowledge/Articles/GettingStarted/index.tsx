import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

const GettingStarted = () => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <MainContent>
      <GridContainer>
        <Grid>
          <HelpBreadcrumb text={t('gettingStarted')} />
          <PageHeading>{t('gettingStarted')}</PageHeading>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default GettingStarted;
