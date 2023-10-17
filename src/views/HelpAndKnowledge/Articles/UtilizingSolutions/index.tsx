import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
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

type ListItem = {
  heading: string;
  description: string;
};

export const UtilizingSolutions = () => {
  const { t } = useTranslation('utilizingSolutions');

  const summaryBoxConfig: string[] = t('summaryBox.items', {
    returnObjects: true
  });

  const timingConfig: ListItem[] = t('timingSteps.items', {
    returnObjects: true
  });

  const activityConfig: ListItem[] = t('activitySteps.items', {
    returnObjects: true
  });

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
              <p className="margin-top-0 margin-bottom-1">
                {t('summaryBox.copy')}
              </p>

              <ol className="padding-left-3 margin-y-0">
                {summaryBoxConfig.map(item => (
                  <li>{item}</li>
                ))}
              </ol>
            </SummaryBox>

            <h2 className="margin-top-6 margin-bottom-2">
              {t('timingSteps.heading')}
            </h2>

            <p className="margin-y-0 line-height-sans-5">
              {t('timingSteps.description')}
            </p>

            <h3 className="margin-top-3 margin-bottom-5">
              {t('timingSteps.subHeading')}
            </h3>

            <ProcessList>
              {timingConfig.map((item, index) => (
                <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-4">
                  <ProcessListHeading
                    type="h5"
                    className="font-body-sm line-height-sans-4 text-normal"
                  >
                    <Trans
                      i18nKey={`utilizingSolutions:timingSteps.items.${index}.heading`}
                      components={{
                        bold: <strong />
                      }}
                    />
                  </ProcessListHeading>
                  <p>{item.description}</p>
                </ProcessListItem>
              ))}
            </ProcessList>

            <SummaryBox
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
            </SummaryBox>

            <h2 className="margin-top-6 margin-bottom-2">
              {t('activitySteps.heading')}
            </h2>

            <p className="margin-y-0 line-height-sans-5">
              {t('activitySteps.description')}
            </p>

            <h3 className="margin-top-3 margin-bottom-6">
              {t('activitySteps.subHeading')}
            </h3>

            <ProcessList>
              {activityConfig.map((item, index) => (
                <ProcessListItem className="read-only-model-plan__timeline__list-item margin-top-neg-4 maxw-full margin-bottom-4">
                  <ProcessListHeading
                    type="h5"
                    className="font-body-sm line-height-sans-4"
                  >
                    {item.heading}
                    <p className="text-normal margin-bottom-0 margin-top-1">
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
            </ProcessList>

            <SummaryBox
              heading={t('helpBox2.heading')}
              className="margin-bottom-6 margin-top-neg-4"
            >
              <p className="margin-bottom-0">{t('helpBox2.description')}</p>
            </SummaryBox>
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle="Utilizing Solutions"
        type="it-implementation"
        viewAllLink
      />
    </>
  );
};

export default UtilizingSolutions;
