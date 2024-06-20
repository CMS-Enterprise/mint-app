import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  Grid,
  GridContainer,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import ExternalLink from 'components/shared/ExternalLink';

import HelpBreadcrumb from '../_components/HelpBreadcrumb';
import HelpCategoryTag from '../_components/HelpCategoryTag';
import RelatedArticles from '../_components/RelatedArticles';

const DataExchangeConceptHelpArticle = () => {
  const { t: decT } = useTranslation('dataExchangeConcept');

  return (
    <>
      <MainContent>
        <GridContainer>
          <Grid>
            <HelpBreadcrumb text={decT('title')} />
            <PageHeading className="margin-bottom-1">
              {decT('title')}
            </PageHeading>
            <HelpCategoryTag
              type="getting-started"
              className="margin-bottom-1"
            />
            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-4">
              {decT('description')}
            </p>

            <Alert type="info" headingLevel="h4" noIcon>
              {decT('alert')}
            </Alert>

            <SummaryBox>
              <SummaryBoxHeading headingLevel="h3">
                {decT('footerSummaryBox.title')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <Trans
                  t={decT}
                  i18nKey="footerSummaryBox.body"
                  components={{
                    email1: (
                      <ExternalLink href="mailto:william.gordon@cms.hhs.gov" />
                    ),
                    email2: <ExternalLink href="mailto:MINTTeam@cms.hhs.gov" />
                  }}
                />
              </SummaryBoxContent>
            </SummaryBox>
          </Grid>
        </GridContainer>
      </MainContent>
      <div className="margin-top-6 margin-bottom-neg-7">
        <RelatedArticles currentArticle={decT('title')} viewAllLink />
      </div>
    </>
  );
};

export default DataExchangeConceptHelpArticle;
