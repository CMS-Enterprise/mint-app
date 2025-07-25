import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  Icon,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import suggestedMilestoneLibraryImg from 'assets/images/04_milestone_library_suggested.png';
import allMilestoneLibraryImg from 'assets/images/05_milestone_library_all.png';
import milestoneLibraryAboutPanelImg from 'assets/images/06_milestone_library_about_panel.png';
import milestoneLibrarySolutionModalImg from 'assets/images/07_milestone_library_solution_modal.png';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import LatestContentUpdate from '../_components/LatestContentUpdate';
import StillNeedMTOHelp from '../_components/StillNeedMTOHelp';
import { ArticleCategories, HelpArticle } from '..';

const UsingMilestoneLibrary = () => {
  const { t } = useTranslation('usingMilestoneLibrary');
  const browsingAllAvailableMilestonesList = tArray<{
    point: string;
    text: string;
  }>('usingMilestoneLibrary:browsingAllAvailableMilestones:list');
  const addSolutionToMilestoneStep4List = tArray<string>(
    'usingMilestoneLibrary:addingMilestoneToMto.step4.list'
  );

  return (
    <div>
      <MainContent>
        <GridContainer>
          <Grid tablet={{ col: 12 }}>
            <HelpBreadcrumb text={t('breadcrumb')} />
            <div className="mint-body-normal">
              <PageHeading className="line-height-large margin-top-4 margin-bottom-2">
                {t('title')}
              </PageHeading>
              <HelpCategoryTag type={ArticleCategories.MTO_TUTORIALS} />
              <p className="mint-body-large margin-top-1 margin-bottom-4">
                {t('description')}
              </p>

              {/* Suggested milestones */}
              <div>
                <h2 className="margin-top-0 margin-bottom-2">
                  {t('suggestedMilestones.title')}
                </h2>
                <p>{t('suggestedMilestones.description')}</p>
                <div className="border-1px radius-md border-gray-10 shadow-3">
                  <img
                    alt={t('suggestedMilestones.altText')}
                    src={suggestedMilestoneLibraryImg}
                  />
                </div>
                <p>{t('suggestedMilestones.caption')}</p>
              </div>

              {/* Browsing all available milestones */}
              <div>
                <h2 className="margin-top-5 margin-bottom-2">
                  {t('browsingAllAvailableMilestones.title')}
                </h2>
                <p>{t('browsingAllAvailableMilestones.description')}</p>

                <div className="border-1px radius-md border-gray-10 shadow-3">
                  <img
                    src={allMilestoneLibraryImg}
                    alt={t('browsingAllAvailableMilestones.altText')}
                  />
                </div>
                <p>{t('browsingAllAvailableMilestones.caption')}</p>
                {browsingAllAvailableMilestonesList.map(item => (
                  <div key={item.point}>
                    <h3 className="margin-bottom-1">{t(item.point)}</h3>
                    <p className="margin-y-0">{t(item.text)}</p>
                  </div>
                ))}
              </div>

              {/* Adding a milestone to your MTO */}
              <div>
                <h2 className="margin-top-5 margin-bottom-2">
                  {t('addingMilestoneToMto.title')}
                </h2>
                <ProcessList>
                  {/* step 1 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('addingMilestoneToMto.step1.title')}
                    </ProcessListHeading>
                    <p>{t('addingMilestoneToMto.step1.description')}</p>

                    <UswdsReactLink
                      aria-label="Redirect to using table actions article"
                      to="using-table-actions"
                      className="display-block margin-y-05"
                    >
                      {t('addingMilestoneToMto.step1.link1')}{' '}
                      <Icon.ArrowForward
                        className="margin-left-1 top-05 text-primary"
                        aria-label="forward"
                      />
                    </UswdsReactLink>
                    <UswdsReactLink
                      aria-label="Redirect to starting mto for a new model article"
                      to="starting-mto-matrix"
                      className="display-block margin-y-05"
                    >
                      {t('addingMilestoneToMto.step1.link2')}{' '}
                      <Icon.ArrowForward
                        className="margin-left-1 top-05 text-primary"
                        aria-label="forward"
                      />
                    </UswdsReactLink>
                  </ProcessListItem>

                  {/* step 2 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('addingMilestoneToMto.step2.title')}
                    </ProcessListHeading>
                    <p>{t('addingMilestoneToMto.step2.description')}</p>
                    <img
                      alt={t('addingMilestoneToMto.step2.altText')}
                      src={milestoneLibraryAboutPanelImg}
                      className="border-1px border-gray-10 radius-md shadow-3"
                    />
                    <p>{t('addingMilestoneToMto.step2.caption')}</p>
                  </ProcessListItem>

                  {/* step 3 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('addingMilestoneToMto.step3.title')}
                    </ProcessListHeading>
                    <p>{t('addingMilestoneToMto.step3.description')}</p>
                  </ProcessListItem>

                  {/* step 4 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('addingMilestoneToMto.step4.title')}
                    </ProcessListHeading>
                    <p className="margin-bottom-0">
                      {t('addingMilestoneToMto.step4.description')}
                    </p>
                    <ul className="margin-y-0 padding-left-3">
                      {addSolutionToMilestoneStep4List.map((item, index) => (
                        <li key={item} className="margin-0">
                          <Trans
                            t={t}
                            i18nKey={`usingMilestoneLibrary:addingMilestoneToMto.step4.list.${index}`}
                            components={{
                              bold: <span className="text-bold" />
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                    <ul className="margin-bottom-2 padding-left-3" />
                    <img
                      alt={t('addingMilestoneToMto.step4.altText')}
                      src={milestoneLibrarySolutionModalImg}
                      className="border-1px border-gray-10 radius-md shadow-3"
                    />
                    <p>{t('addingMilestoneToMto.step4.caption')}</p>
                  </ProcessListItem>

                  {/* step 5 */}
                  <ProcessListItem className="maxw-none padding-bottom-0">
                    <ProcessListHeading type="h3">
                      {t('addingMilestoneToMto.step5.title')}
                    </ProcessListHeading>
                    <p>{t('addingMilestoneToMto.step5.description')}</p>
                  </ProcessListItem>
                </ProcessList>
              </div>

              {/* Still need help */}
              <StillNeedMTOHelp />

              <LatestContentUpdate file="usingMilestoneLibrary.ts" />
            </div>
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle={HelpArticle.USING_MILESTONE_TABLE}
        specificArticles={[
          HelpArticle.ADD_CUSTOM_MILESTONE,
          HelpArticle.USING_MILESTONE_TABLE,
          HelpArticle.USING_TABLE_ACTIONS
        ]}
        viewAllLink
      />
    </div>
  );
};
export default UsingMilestoneLibrary;
