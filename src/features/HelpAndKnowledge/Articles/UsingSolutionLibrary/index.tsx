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

import SolutionLibraryAbout from 'assets/images/25_solution_library_about_solution.png';
import SolutionLibraryAddModal from 'assets/images/26_solution_library_add_to_milestone_modal.png';
import SolutionLibraryAll from 'assets/images/27_solution_library_all.png';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import RelatedArticles from '../_components/RelatedArticles';
import StillNeedMTOHelp from '../_components/StillNeedMTOHelp';
import { ArticleCategories, HelpArticle } from '..';

import '../index.scss';

export const UsingSolutionLibrary = () => {
  const { t } = useTranslation('usingSolutionLibrary');

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

              <HelpCategoryTag type={ArticleCategories.MTO_TUTORIALS} />

              <p className="mint-body-large margin-top-1 margin-bottom-4">
                {t('description')}
              </p>

              <h2 className="margin-top-0 margin-bottom-2">
                {t('browsingAllAvailableSolutions')}
              </h2>

              <p>{t('browsingAllAvailableSolutionsDescription')}</p>

              <img
                alt={t('step1.altText')}
                src={SolutionLibraryAll}
                className="border-1px border-gray-10 radius-md shadow-2"
              />

              <p>{t('browsingAllAvailableSolutionsCaption')}</p>

              <h3 className="margin-bottom-1">{t('searching')}</h3>

              <p className="margin-y-0">{t('searchingDescription')}</p>

              <h3 className="margin-bottom-1">{t('filtering')}</h3>

              <p className="margin-top-0">{t('filteringDescription')}</p>

              <h3 className="margin-bottom-1">{t('pagination')}</h3>

              <p className="margin-top-0">{t('paginationDescription')}</p>

              <ProcessList>
                {/* STEP 1 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step1.heading')}
                  </ProcessListHeading>

                  <p>{t('step1.text')}</p>

                  <UswdsReactLink
                    to="/help-and-knowledge/using-table-actions"
                    className="display-block margin-y-05"
                  >
                    {t('step1.link1')} <Icon.ArrowForward className="top-3px" />
                  </UswdsReactLink>

                  <UswdsReactLink
                    to="/help-and-knowledge/using-table-actions"
                    className="display-block"
                  >
                    {t('step1.link2')} <Icon.ArrowForward className="top-3px" />
                  </UswdsReactLink>
                </ProcessListItem>

                {/* STEP 2 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step2.heading')}
                  </ProcessListHeading>

                  <p>{t('step2.text')}</p>

                  <img
                    alt={t('step2.altText')}
                    src={SolutionLibraryAbout}
                    className="border-1px border-gray-10 radius-md shadow-2"
                  />

                  <p>{t('step2.caption')}</p>
                </ProcessListItem>

                {/* STEP 3 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step3.heading')}
                  </ProcessListHeading>

                  <p>{t('step3.text')}</p>
                </ProcessListItem>

                {/* STEP 4 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step4.heading')}
                  </ProcessListHeading>

                  <p className="margin-bottom-0">{t('step4.text')}</p>

                  <ul className="margin-bottom-2">
                    <li className="margin-0">
                      <Trans
                        t={t}
                        i18nKey="step4.listItem"
                        components={{
                          bold: <span className="text-bold" />
                        }}
                      />
                    </li>
                  </ul>

                  <img
                    alt={t('step4.altText')}
                    src={SolutionLibraryAddModal}
                    className="border-1px border-gray-10 radius-md shadow-2"
                  />

                  <p>{t('step4.caption')}</p>
                </ProcessListItem>

                {/* STEP 5 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step5.heading')}
                  </ProcessListHeading>

                  <p className="margin-bottom-0">{t('step5.text')}</p>
                </ProcessListItem>
              </ProcessList>

              <StillNeedMTOHelp />
            </div>
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle={HelpArticle.STARTING_MTO}
        specificArticles={[
          HelpArticle.USING_MILESTONE_LIBRARY,
          HelpArticle.USING_SOLUTION_LIBRARY,
          HelpArticle.ADD_CUSTOM_MILESTONE
        ]}
        viewAllLink
      />
    </div>
  );
};

export default UsingSolutionLibrary;
