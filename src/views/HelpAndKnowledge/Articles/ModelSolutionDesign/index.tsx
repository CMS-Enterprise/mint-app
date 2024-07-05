import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
import HelpBreadcrumb from 'views/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import RelatedArticles from 'views/HelpAndKnowledge/Articles/_components/RelatedArticles';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import {
  ArticleCategories,
  covertToLowercaseAndDashes,
  HelpArticle,
  ScrollLink
} from '..';

export const ModelSolutionDesign = () => {
  const { t } = useTranslation('modelSolutionDesign');

  const summaryBoxConfig: string[] = t('summaryBox.items', {
    returnObjects: true
  });

  const startModelPlanActivitiesConfig: any[] = t(
    'startModelPlan.activities.items',
    {
      returnObjects: true
    }
  );

  const assembleTeamActivitiesConfig: any[] = t(
    'assembleTeam.activities.items',
    {
      returnObjects: true
    }
  );

  const identifySolutionsActivitiesConfig: any[] = t(
    'identifySolutions.activities.items',
    {
      returnObjects: true
    }
  );

  const startModelPlanOutcomesConfig: any[] = t(
    'startModelPlan.outcomes.items',
    {
      returnObjects: true
    }
  );

  const assembleTeamOutcomesConfig: any[] = t('assembleTeam.outcomes.items', {
    returnObjects: true
  });

  const identifySolutionsOutcomesConfig: any[] = t(
    'identifySolutions.outcomes.items',
    {
      returnObjects: true
    }
  );

  const identifySolutionsWhenConfig: any[] = t('identifySolutions.whenItems', {
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

            {/* START MODEL PLAN */}

            <h2
              id={covertToLowercaseAndDashes(t('summaryBox.items.0'))}
              className="margin-top-6 margin-bottom-2"
            >
              {t('startModelPlan.heading')}
            </h2>

            <h3 className="margin-top-3 margin-bottom-1">
              {t('startModelPlan.purpose')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('startModelPlan.purposeDescription')}
            </p>

            <h3 className="margin-top-3 margin-bottom-1">
              {t('startModelPlan.when')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('startModelPlan.whenDescription')}
            </p>

            <h3 className="margin-top-3 margin-bottom-4">
              {t('startModelPlan.activities.heading')}
            </h3>

            <ProcessList>
              {startModelPlanActivitiesConfig.map((activity, index) => (
                <ProcessListItem
                  key={activity.heading}
                  className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-3 padding-left-2"
                >
                  <ProcessListHeading type="h5" className="font-body-sm">
                    {activity.heading}
                  </ProcessListHeading>

                  <p className="margin-top-105">
                    <Trans
                      i18nKey={`modelSolutionDesign:startModelPlan.activities.items.${index}.description`}
                      components={{
                        link1: (
                          // @ts-ignore
                          <UswdsReactLink
                            to="/models/steps-overview"
                            className="margin-top-2 display-block display-flex flex-align-center text-bold"
                          />
                        ),
                        iconForward: (
                          <Icon.ArrowForward className="margin-left-1 text-bold" />
                        )
                      }}
                    />
                  </p>
                </ProcessListItem>
              ))}
            </ProcessList>

            <h3 className="margin-top-neg-2 margin-bottom-1">
              {t('startModelPlan.outcomes.heading')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('startModelPlan.outcomes.description')}
            </p>

            <ol className="padding-left-8 margin-bottom-6">
              {startModelPlanOutcomesConfig.map(item => (
                <li key={item} className="line-height-sans-5">
                  {item}
                </li>
              ))}
            </ol>

            {/* ASSEMBLE TEAM */}

            <h2
              id={covertToLowercaseAndDashes(t('summaryBox.items.1'))}
              className="margin-top-7 margin-bottom-2"
            >
              {t('assembleTeam.heading')}
            </h2>

            <h3 className="margin-top-3 margin-bottom-1">
              {t('assembleTeam.purpose')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('assembleTeam.purposeDescription')}
            </p>

            <h3 className="margin-top-3 margin-bottom-1">
              {t('assembleTeam.when')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('assembleTeam.whenDescription')}
            </p>

            <h3 className="margin-top-3 margin-bottom-4">
              {t('assembleTeam.activities.heading')}
            </h3>

            <ProcessList>
              {assembleTeamActivitiesConfig.map(activity => (
                <ProcessListItem
                  key={activity.heading}
                  className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-3 padding-left-2"
                >
                  <ProcessListHeading type="h5" className="font-body-sm">
                    {activity.heading}
                  </ProcessListHeading>

                  <p className="margin-top-105">{activity.description}</p>
                </ProcessListItem>
              ))}
            </ProcessList>

            <h3 className="margin-top-neg-2 margin-bottom-1">
              {t('assembleTeam.outcomes.heading')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('assembleTeam.outcomes.description')}
            </p>

            <ol className="padding-left-8 margin-bottom-6">
              {assembleTeamOutcomesConfig.map(item => (
                <li key={item} className="line-height-sans-5">
                  {item}
                </li>
              ))}
            </ol>

            {/* IDENTIFY SOLUTIONS */}

            <h2
              id={covertToLowercaseAndDashes(t('summaryBox.items.2'))}
              className="margin-top-7 margin-bottom-2"
            >
              {t('identifySolutions.heading')}
            </h2>

            <h3 className="margin-top-3 margin-bottom-1">
              {t('identifySolutions.purpose')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('identifySolutions.purposeDescription')}
            </p>

            <h3 className="margin-top-3 margin-bottom-1">
              {t('identifySolutions.when')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('identifySolutions.whenDescription')}
            </p>

            <ol className="padding-left-8 margin-bottom-1">
              {identifySolutionsWhenConfig.map(item => (
                <li key={item} className="line-height-sans-5">
                  {item}
                </li>
              ))}
            </ol>

            <p className="margin-y-0 line-height-sans-5 padding-left-6">
              {t('identifySolutions.whenDescription2')}
            </p>

            <h3 className="margin-top-4 margin-bottom-4">
              {t('identifySolutions.activities.heading')}
            </h3>

            <ProcessList>
              {identifySolutionsActivitiesConfig.map(activity => (
                <ProcessListItem
                  key={activity.heading}
                  className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-3 padding-left-2"
                >
                  <ProcessListHeading type="h5" className="font-body-sm">
                    {activity.heading}
                  </ProcessListHeading>

                  <p className="margin-top-105">{activity.description}</p>
                </ProcessListItem>
              ))}
            </ProcessList>

            <h3 className="margin-top-neg-2 margin-bottom-1">
              {t('identifySolutions.outcomes.heading')}
            </h3>

            <p className="margin-y-0 line-height-sans-5">
              {t('identifySolutions.outcomes.description')}
            </p>

            <ol className="padding-left-8 margin-bottom-6">
              {identifySolutionsOutcomesConfig.map(item => (
                <li key={item} className="line-height-sans-5">
                  {item}
                </li>
              ))}
            </ol>
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle={HelpArticle.MODEL_SOLUTION_DESIGN}
        specificArticles={[
          HelpArticle.PHASES_INVOLVED,
          HelpArticle.MODEL_SOLUTION_IMPLEMENTATION,
          HelpArticle.UTILIZING_SOLUTIONS
        ]}
        type={ArticleCategories.IT_IMPLEMENTATION}
        viewAllLink
      />
    </>
  );
};

export default ModelSolutionDesign;
