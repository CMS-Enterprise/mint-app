import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  Icon,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import {
  ArticleCategories,
  covertToLowercaseAndDashes,
  HelpArticle,
  ScrollLink
} from '..';

export const ModelSolutionImplementation = () => {
  const { t } = useTranslation('modelSolutionImplementation');

  const summaryBoxConfig: string[] = t('summaryBox.items', {
    returnObjects: true
  });

  const determinePriorityConfig: string[] = t(
    'initiateWork.activities.items.1.items',
    {
      returnObjects: true
    }
  );

  const stayInformedConfig: string[] = t('trackWork.activities.items.0.items', {
    returnObjects: true
  });

  const trackProgressConfig: any[] = t('trackWork.activities.items.1.items', {
    returnObjects: true
  });

  const outcomesConfig: any[] = t('trackWork.outcomes.items', {
    returnObjects: true
  });

  return (
    <>
      <MainContent>
        <GridContainer>
          <Grid desktop={{ col: 12 }}>
            <HelpBreadcrumb text={t('title')} />

            <PageHeading className="margin-bottom-1 margin-top-4">
              {t('title')}
            </PageHeading>

            <HelpCategoryTag
              type={ArticleCategories.IT_IMPLEMENTATION}
              className="margin-bottom-1"
            />

            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-4">
              {t('description')}
            </p>

            <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2">
              <SummaryBoxHeading
                headingLevel="h3"
                className="margin-top-0 margin-bottom-1"
              >
                {t('summaryBox.copy')}
              </SummaryBoxHeading>

              <SummaryBoxContent>
                <ol className="padding-left-5 margin-y-0">
                  {summaryBoxConfig.map((item, index) => (
                    <li key={item} className="margin-bottom-1">
                      <div className="margin-left-1 display-flex flex-align-center">
                        <ScrollLink scrollTo={item} />
                      </div>
                    </li>
                  ))}
                </ol>
              </SummaryBoxContent>
            </SummaryBox>

            {/* INITIATE WORK */}

            <h2
              id={covertToLowercaseAndDashes(t('summaryBox.items.0'))}
              className="margin-top-6 margin-bottom-2"
            >
              {t('initiateWork.heading')}
            </h2>

            <h3 className="margin-top-3 margin-bottom-1">
              {t('initiateWork.purpose')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('initiateWork.purposeDescription')}
            </p>

            <h3 className="margin-top-3 margin-bottom-1">
              {t('initiateWork.when')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('initiateWork.whenDescription')}
            </p>

            <h3 className="margin-top-3 margin-bottom-4">
              {t('initiateWork.activities.heading')}
            </h3>

            <ProcessList>
              <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-3 padding-left-2">
                <ProcessListHeading type="h5" className="font-body-sm">
                  {t('initiateWork.activities.items.0.heading')}
                </ProcessListHeading>
                <p className="margin-top-105">
                  {t('initiateWork.activities.items.0.description')}
                </p>
              </ProcessListItem>

              <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-0 padding-bottom-0 padding-left-2">
                <ProcessListHeading type="h5" className="font-body-sm">
                  {t('initiateWork.activities.items.1.heading')}
                </ProcessListHeading>

                <p className="margin-top-105 margin-bottom-1">
                  {t('initiateWork.activities.items.1.description')}
                </p>

                <ul className="padding-left-5 margin-y-0">
                  {determinePriorityConfig.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="margin-top-2 margin-bottom-4 display-flex flex-align-center text-bold">
                  <UswdsReactLink
                    to="/help-and-knowledge/utilizing-solutions"
                    className="margin-right-1"
                  >
                    {t('initiateWork.activities.learnMore')}
                  </UswdsReactLink>
                  <Icon.ArrowForward />
                </div>
              </ProcessListItem>
            </ProcessList>

            <h3 className="margin-top-1 margin-bottom-1">
              {t('initiateWork.outcomes.heading')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('initiateWork.outcomes.description')}
            </p>

            <ol className="padding-left-7">
              <li>{t('initiateWork.outcomes.items.0')}</li>
            </ol>

            {/* TRACK WORK */}

            <h2
              id={covertToLowercaseAndDashes(t('summaryBox.items.1'))}
              className="margin-top-7 margin-bottom-2"
            >
              {t('trackWork.heading')}
            </h2>

            <h3 className="margin-top-3 margin-bottom-1">
              {t('trackWork.purpose')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('trackWork.purposeDescription')}
            </p>

            <h3 className="margin-top-3 margin-bottom-1">
              {t('trackWork.when')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('trackWork.whenDescription')}
            </p>

            <h3 className="margin-top-3 margin-bottom-4">
              {t('trackWork.activities.heading')}
            </h3>

            <ProcessList>
              <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-3 padding-left-2">
                <ProcessListHeading type="h5" className="font-body-sm">
                  {t('trackWork.activities.items.0.heading')}
                </ProcessListHeading>

                <p className="margin-top-105 margin-bottom-1">
                  {t('trackWork.activities.items.0.description')}
                </p>

                <ul className="padding-left-5 margin-y-0">
                  {stayInformedConfig.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </ProcessListItem>

              <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-0 padding-bottom-0 padding-left-2">
                <ProcessListHeading type="h5" className="font-body-sm">
                  {t('trackWork.activities.items.1.heading')}
                </ProcessListHeading>

                <p className="margin-top-105 margin-bottom-1">
                  {t('trackWork.activities.items.1.description')}
                </p>

                <ul className="padding-left-5 margin-y-0">
                  {trackProgressConfig.map(item => {
                    let listItem = <></>;
                    if (item.items) {
                      listItem = (
                        <ul className="padding-left-5 margin-y-0">
                          {item.items.map((item2: string) => {
                            return <li key={item2}>{item2}</li>;
                          })}
                        </ul>
                      );
                    }
                    return (
                      <li key={item.heading}>
                        {item.heading}
                        {listItem}
                      </li>
                    );
                  })}
                </ul>
              </ProcessListItem>
            </ProcessList>

            <h3 className="margin-top-3 margin-bottom-1">
              {t('trackWork.outcomes.heading')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('trackWork.outcomes.description')}
            </p>

            <ol className="padding-left-7 margin-bottom-6">
              {outcomesConfig.map(item => (
                <li key={item} className="padding-bottom-1">
                  {item}
                </li>
              ))}
            </ol>
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle={HelpArticle.MODEL_SOLUTION_IMPLEMENTATION}
        specificArticles={[
          HelpArticle.PHASES_INVOLVED,
          HelpArticle.MODEL_SOLUTION_DESIGN,
          HelpArticle.UTILIZING_SOLUTIONS
        ]}
        type={ArticleCategories.IT_IMPLEMENTATION}
        viewAllLink
      />
    </>
  );
};

export default ModelSolutionImplementation;
