import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import HelpCardGroup from '../_components/HelpCardGroup';

const AllArticles = () => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <MainContent>
      <GridContainer>
        <Grid>
          <HelpBreadcrumb text={t('allHelpArticles')} />
          <PageHeading>{t('allHelpArticles')}</PageHeading>

          <HelpCardGroup className="margin-y-2" tag pagination />
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default AllArticles;
