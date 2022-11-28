import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import HelpCardGroup from '../_components/HelpCardGroup';

const ITImplementation = () => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <MainContent>
      <GridContainer>
        <Grid>
          <HelpBreadcrumb text={t('itImplementation')} />
          <PageHeading className="margin-bottom-1">
            {t('itImplementation')}
          </PageHeading>
          <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-6">
            {t('itImplementationInstructions')}
          </p>
          <HelpCardGroup
            className="margin-y-2"
            filter="itImplementation"
            tag={false}
          />
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default ITImplementation;
