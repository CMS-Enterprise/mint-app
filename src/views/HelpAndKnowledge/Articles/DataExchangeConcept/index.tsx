import React, { Fragment } from 'react';
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

  const headingRow: string[] = decT('table.headingRow', {
    returnObjects: true
  });
  const rows: string[] = decT('table.rows', {
    returnObjects: true
  });

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

            <Alert
              type="info"
              headingLevel="h4"
              noIcon
              className="margin-bottom-6"
            >
              {decT('alert')}
            </Alert>

            <Grid row className="margin-bottom-6">
              {headingRow.map((heading, index) => (
                <Grid
                  col={6}
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="border-bottom-2px position-sticky bg-white z-100"
                  style={{ top: '54px' }}
                >
                  <p className="margin-y-1 margin-left-2 text-bold">
                    {heading}
                  </p>
                </Grid>
              ))}
              {rows.map(row => {
                return (
                  <Fragment key={row}>
                    <Grid
                      col={row !== 'additionalItems' ? 6 : 12}
                      className="border-bottom padding-y-2 padding-x-2"
                    >
                      <p className="margin-y-0 text-bold line-height-sans-4">
                        {decT(`table.${row}.category`)}
                      </p>
                      {decT(`table.${row}.description`).includes('<bullet>') ? (
                        <ul className="margin-y-0 padding-left-0 line-height-sans-4">
                          <Trans
                            t={decT}
                            i18nKey={`table.${row}.description`}
                            components={{
                              bullet: <li className="margin-left-2" />,
                              p: <p className="padding-left-0 margin-y-0" />
                            }}
                          />
                        </ul>
                      ) : (
                        <p className="margin-y-0 line-height-sans-4">
                          {decT(`table.${row}.description`)}
                        </p>
                      )}
                    </Grid>
                    {row !== 'additionalItems' && (
                      <Grid
                        col={6}
                        className="border-bottom padding-y-2 padding-x-2"
                      >
                        <p className="margin-y-0 line-height-sans-4">
                          {decT(`table.${row}.exampleAnswer`)}
                        </p>
                      </Grid>
                    )}
                  </Fragment>
                );
              })}
            </Grid>

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
        <RelatedArticles
          currentArticle={decT('title')}
          specificArticleNames={[
            'How to have a successful 2-pager meeting',
            'How to have a successful 6-pager meeting',
            'High-level project plans'
          ]}
          type="getting-started"
          viewAllLink
        />
      </div>
    </>
  );
};

export default DataExchangeConceptHelpArticle;
