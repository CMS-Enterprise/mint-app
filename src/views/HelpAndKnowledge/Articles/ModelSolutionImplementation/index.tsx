import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  IconArrowForward,
  ProcessList,
  ProcessListHeading,
  ProcessListItem,
  SummaryBox
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import HelpBreadcrumb from 'views/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import RelatedArticles from 'views/HelpAndKnowledge/Articles/_components/RelatedArticles';

import HelpCategoryTag from '../_components/HelpCategoryTag';

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

  return (
    <>
      <MainContent>
        <GridContainer>
          <Grid desktop={{ col: 12 }}>
            <HelpBreadcrumb text={t('title')} />

            <PageHeading className="margin-bottom-1">{t('title')}</PageHeading>

            <HelpCategoryTag
              type="it-implementation"
              className="margin-bottom-1"
            />

            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-4">
              {t('description')}
            </p>

            <SummaryBox
              heading=""
              className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2"
            >
              <h3 className="margin-top-0 margin-bottom-1">
                {t('summaryBox.copy')}
              </h3>

              <ol className="padding-left-5 margin-y-0">
                {summaryBoxConfig.map(item => (
                  <li className="margin-bottom-1">
                    <div className="margin-left-1 display-flex flex-align-center">
                      <UswdsReactLink to="/" className="margin-right-1">
                        {item}
                      </UswdsReactLink>
                      <IconArrowForward />
                    </div>
                  </li>
                ))}
              </ol>
            </SummaryBox>

            <h2 className="margin-top-6 margin-bottom-2">
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
              <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-2">
                <ProcessListHeading type="h5" className="font-body-sm">
                  {t('initiateWork.activities.items.0.heading')}
                </ProcessListHeading>
                <p className="margin-top-105">
                  {t('initiateWork.activities.items.0.description')}
                </p>
              </ProcessListItem>

              <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-0 padding-bottom-0">
                <ProcessListHeading type="h5" className="font-body-sm">
                  {t('initiateWork.activities.items.1.heading')}
                </ProcessListHeading>

                <p className="margin-top-105 margin-bottom-1">
                  {t('initiateWork.activities.items.1.description')}
                </p>

                <ul className="padding-left-5 margin-y-0">
                  {determinePriorityConfig.map(item => (
                    <li>{item}</li>
                  ))}
                </ul>

                <UswdsReactLink to="/" className="margin-right-1">
                  <div className="margin-top-2 display-flex flex-align-center text-bold">
                    <UswdsReactLink to="/" className="margin-right-1">
                      {t('initiateWork.activities.learnMore')}
                    </UswdsReactLink>
                    <IconArrowForward />
                  </div>
                </UswdsReactLink>
              </ProcessListItem>
            </ProcessList>

            <h3 className="margin-top-1 margin-bottom-1">
              {t('initiateWork.outcomes.heading')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('initiateWork.outcomes.description')}
            </p>

            <ol className="padding-left-5">
              <li>{t('initiateWork.outcomes.items.0')}</li>
            </ol>

            {/* <SummaryBox
              heading={t('helpBox.heading')}
              className="margin-bottom-6 margin-top-neg-4"
            >
              <Trans
                i18nKey="utilizingSolutions:helpBox.description"
                components={{
                  link1: (
                    // @ts-ignore
                    <UswdsReactLink
                      to="/help-and-knowledge/operational-solutions?page=1"
                      className="margin-top-2 display-inline-block"
                    />
                  )
                }}
              />
            </SummaryBox> */}

            {/* <h2 className="margin-top-6 margin-bottom-2">
              {t('activitySteps.heading')}
            </h2>

            <p className="margin-y-0 line-height-sans-5">
              {t('activitySteps.description')}
            </p>

            <h3 className="margin-top-3 margin-bottom-6">
              {t('activitySteps.subHeading')}
            </h3> */}

            {/* <ProcessList>
              {activityConfig.map((item, index) => (
                <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-4">
                  <ProcessListHeading type="h5" className="font-body-sm">
                    {item.heading}
                    <p className="text-normal margin-bottom-0 margin-top-105">
                      <Trans
                        i18nKey={`utilizingSolutions:activitySteps.items.${index}.description`}
                        components={{
                          bold: <strong />
                        }}
                      />
                    </p>
                  </ProcessListHeading>
                </ProcessListItem>
              ))}
            </ProcessList> */}

            {/* <SummaryBox
              heading={t('helpBox2.heading')}
              className="margin-bottom-6 margin-top-neg-4"
            >
              <p className="margin-bottom-0">{t('helpBox2.description')}</p>
            </SummaryBox> */}
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle="Model implementation and solution implementation"
        type="it-implementation"
        viewAllLink
      />
    </>
  );
};

export default ModelSolutionImplementation;
