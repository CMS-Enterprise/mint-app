import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  Icon,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import HelpBreadcrumb from 'views/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import RelatedArticles from 'views/HelpAndKnowledge/Articles/_components/RelatedArticles';

import HelpCategoryTag from '../_components/HelpCategoryTag';

type StepsType = {
  heading: string;
  description: string;
  description2: string;
  activities: string[];
  linkText: string;
  link: string;
};

export const PhasesInvolved = () => {
  const { t } = useTranslation('phasesInvolved');

  const stepsConfig: StepsType[] = t('steps', {
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
              type="it-implementation"
              className="margin-bottom-1"
            />

            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-4">
              {t('description')}
            </p>

            <Grid
              desktop={{ col: 6 }}
              className="margin-top-105 margin-bottom-4"
            >
              <ProcessList>
                {stepsConfig.map(step => (
                  <ProcessListItem key={step.heading}>
                    <ProcessListHeading type="h3">
                      {step.heading}
                    </ProcessListHeading>

                    <p>{step.description}</p>

                    <p className="margin-bottom-0">{step.description2}</p>

                    <ul>
                      {step.activities.map(activity => (
                        <li key={activity}>{activity}</li>
                      ))}
                    </ul>

                    <div className="margin-top-2 display-flex flex-align-center">
                      <UswdsReactLink to={step.link} className="margin-right-1">
                        {step.linkText}
                      </UswdsReactLink>
                      <Icon.ArrowForward />
                    </div>
                  </ProcessListItem>
                ))}
              </ProcessList>
            </Grid>
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle="Phases Involved"
        specificArticleNames={[
          'Model design and solution design',
          'Model implementation and solution implementation',
          'Utilizing available operational solutions'
        ]}
        type="it-implementation"
        viewAllLink
      />
    </>
  );
};

export default PhasesInvolved;
