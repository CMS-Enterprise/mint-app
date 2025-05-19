import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Card,
  Grid,
  GridContainer,
  // Icon,
  Link,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';

// import i18next from 'i18next';
import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import RelatedArticles from '../_components/RelatedArticles';
import { ArticleCategories, HelpArticle } from '..';

export const CreatingMTOMatrix = () => {
  const { t } = useTranslation('creatingMtoMatrix');

  const editAccessList = tArray<string>('creatingMtoMatrix:editAccessList');
  const readViewList = tArray<string>('creatingMtoMatrix:readViewList');
  const itLeadList = tArray<string>('creatingMtoMatrix:itLeadList');
  const modelTeamList = tArray<string>('creatingMtoMatrix:modelTeamList');
  const bsgCMMILeadershipList = tArray<string>(
    'creatingMtoMatrix:bsgCMMILeadershipList'
  );
  const otherCMSStaffList = tArray<string>(
    'creatingMtoMatrix:otherCMSStaffList'
  );
  const recommendProcessList = tArray<any>(
    'creatingMtoMatrix:recommendProcessList'
  );

  // const mtoTutorialArticles = helpAndKnowledgeArticles
  //   .filter(article => article.type === ArticleCategories.MTO_TUTORIALS)
  //   .sort((a, b) => {
  //     if (a.key === 'STARTING_MTO') return -1; // Move STARTING_MTO to the top
  //     if (b.key === 'STARTING_MTO') return 1; // Keep other articles below STARTING_MTO
  //     return 0; // Maintain the order of other articles
  //   });

  return (
    <div>
      <MainContent>
        <GridContainer>
          <Grid tablet={{ col: 12 }}>
            <HelpBreadcrumb text={t('breadcrumb')} />
            <div className="mint-body-medium">
              <PageHeading className="line-height-large margin-bottom-2 margin-top-4">
                {t('title')}
              </PageHeading>

              <HelpCategoryTag type={ArticleCategories.IT_IMPLEMENTATION} />

              <p className="mint-body-large margin-top-1 margin-bottom-4">
                {t('description')}
              </p>

              <h2 className="margin-top-4 margin-bottom-1">{t('whatIsMTO')}</h2>

              <p className="margin-bottom-3 margin-top-1">
                {t('whatIsMTODescription')}
              </p>

              <h3 className="margin-top-3 margin-bottom-1">
                {t('whyCreateMTO')}
              </h3>

              <p className="margin-bottom-2 margin-top-1">
                {t('whyCreateMTODescription')}
              </p>

              <Grid row gap={2}>
                <Grid tablet={{ col: 6 }} className="margin-bottom-1">
                  <Card
                    className="margin-0 height-full"
                    containerProps={{
                      className: 'padding-2 radius-md margin-0'
                    }}
                  >
                    <h4 className="margin-y-0">{t('editAccess')}</h4>

                    <p className="margin-y-1">{t('editAccessDescription')}</p>

                    <ul className="margin-0">
                      {editAccessList.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                </Grid>

                <Grid tablet={{ col: 6 }} className="margin-bottom-1">
                  <Card
                    className="margin-0 height-full"
                    containerProps={{
                      className: 'padding-2 radius-md margin-0'
                    }}
                  >
                    <h4 className="margin-y-0">{t('readView')}</h4>

                    <p className="margin-y-1">{t('readViewDescription')}</p>

                    <ul className="margin-0">
                      {readViewList.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                </Grid>
              </Grid>

              <h3 className="margin-top-3 margin-bottom-1">
                {t('whyCreateMTO')}
              </h3>

              <p className="margin-bottom-2 margin-top-1">
                {t('whyCreateMTODescription')}
              </p>

              <Grid row gap={2} className="margin-bottom-1">
                <Grid tablet={{ col: 6 }} className="margin-bottom-1">
                  <Card
                    className="margin-0 height-full"
                    containerProps={{
                      className: 'padding-2 radius-md margin-0'
                    }}
                  >
                    <h4 className="margin-y-0">{t('itLead')}</h4>

                    <p className="margin-y-1">{t('itLeadDescription')}</p>

                    <ul className="margin-0">
                      {itLeadList.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                </Grid>

                <Grid tablet={{ col: 6 }} className="margin-bottom-1">
                  <Card
                    className="margin-0 height-full"
                    containerProps={{
                      className: 'padding-2 radius-md margin-0'
                    }}
                  >
                    <h4 className="margin-y-0">{t('modelTeam')}</h4>

                    <p className="margin-y-1">{t('modelTeamDescription')}</p>

                    <ul className="margin-0">
                      {modelTeamList.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                </Grid>
              </Grid>

              <Grid row gap={2}>
                <Grid tablet={{ col: 6 }} className="margin-bottom-1">
                  <Card
                    className="margin-0 height-full"
                    containerProps={{
                      className: 'padding-2 radius-md margin-0'
                    }}
                  >
                    <h4 className="margin-y-0">{t('bsgCMMILeadership')}</h4>

                    <p className="margin-y-1">
                      {t('bsgCMMILeadershipDescription')}
                    </p>

                    <ul className="margin-0">
                      {bsgCMMILeadershipList.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                </Grid>

                <Grid tablet={{ col: 6 }} className="margin-bottom-1">
                  <Card
                    className="margin-0 height-full"
                    containerProps={{
                      className: 'padding-2 radius-md margin-0'
                    }}
                  >
                    <h4 className="margin-y-0">{t('otherCMSStaff')}</h4>

                    <p className="margin-y-1">
                      {t('otherCMSStaffDescription')}
                    </p>

                    <ul className="margin-0">
                      {otherCMSStaffList.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </Card>
                </Grid>
              </Grid>

              <h2 className="margin-top-4 margin-bottom-1">
                {t('partsOfMTO')}
              </h2>

              <p className="margin-bottom-3 margin-top-1">
                {t('partsOfMTODescription')}
              </p>

              <h3 className="margin-top-3 margin-bottom-1">
                {t('milestones')}
              </h3>

              <p className="margin-bottom-2 margin-top-1">
                {t('milestonesDescription')}
              </p>

              <h3 className="margin-top-3 margin-bottom-1">
                {t('categories')}
              </h3>

              <p className="margin-bottom-2 margin-top-1">
                {t('categoriesDescription')}
              </p>

              <h3 className="margin-top-3 margin-bottom-1">{t('itSystems')}</h3>

              <p className="margin-bottom-2 margin-top-1">
                <Trans
                  i18nKey="creatingMtoMatrix:itSystemsDescription"
                  components={{
                    link1: (
                      <UswdsReactLink to="/help-and-knowledge/operational-solutions">
                        {' '}
                      </UswdsReactLink>
                    )
                  }}
                />
              </p>

              <h3 className="margin-top-3 margin-bottom-1">{t('templates')}</h3>

              <p className="margin-bottom-2 margin-top-1">
                {t('templatesDescription')}
              </p>

              <h2 className="margin-top-4 margin-bottom-1 line-height-large">
                {t('recommendProcess')}
              </h2>

              <ProcessList>
                {recommendProcessList.map(item => (
                  <ProcessListItem key={item.title} className="maxw-none">
                    <ProcessListHeading type="h3">
                      {item.title}
                    </ProcessListHeading>
                    <p>{item.description}</p>
                  </ProcessListItem>
                ))}
              </ProcessList>

              {/* TODO: renable once MTO tutoarial articles are complete */}
              {/* <div className="bg-base-lightest padding-2">
                <h3 className="margin-top-1 margin-bottom-1">
                  {t('mtoTutorials')}
                </h3>

                <p className="margin-bottom-2 margin-top-1">
                  {t('mtoTutorialsDescription')}
                </p>

                <Grid row>
                  {mtoTutorialArticles.map(article => {
                    return (
                      <Grid tablet={{ col: 6 }} key={article.key}>
                        <UswdsReactLink
                          className="fit-content display-flex flex-align-center margin-y-05"
                          to={`/help-and-knowledge${article.route}`}
                        >
                          <span>
                            {i18next.t(`${article.translation}:title`)}
                            <Icon.ArrowForward className="margin-left-1 top-2px" />
                          </span>
                        </UswdsReactLink>
                      </Grid>
                    );
                  })}
                </Grid>
              </div> */}

              <h2 className="margin-top-5 margin-bottom-1 line-height-large">
                {t('stillNeedHelp')}
              </h2>

              <p className="margin-bottom-6 margin-top-1">
                <Trans
                  i18nKey="creatingMtoMatrix:stillNeedHelpDescription"
                  components={{
                    email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>,
                    slack: (
                      <ExternalLink href="https://cmsgov.slack.com/archives/C04B10ZN6A2">
                        {' '}
                      </ExternalLink>
                    )
                  }}
                />
              </p>
            </div>
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle={HelpArticle.CREATING_MTO_MATRIX}
        specificArticles={[
          HelpArticle.PHASES_INVOLVED,
          HelpArticle.MODEL_SOLUTION_IMPLEMENTATION,
          HelpArticle.UTILIZING_SOLUTIONS
        ]}
        viewAllLink
      />
    </div>
  );
};

export default CreatingMTOMatrix;
