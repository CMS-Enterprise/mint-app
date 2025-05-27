import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';

import emptyMTO from 'assets/images/02_Empty MTO.png';
import MTOTableTabs from 'assets/images/13_MTO table tabs.png';
import SolutinEditPanel from 'assets/images/16_Solution edit panel.png';
import MTOSolutionTableOption from 'assets/images/19_MTO solution table_option 3.png';
import CollaborationAreaInProgress from 'assets/images/33_Collaboration area in progress.png';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import RelatedArticles from '../_components/RelatedArticles';
import StillNeedMTOHelp from '../_components/StillNeedMTOHelp';
import { ArticleCategories, HelpArticle } from '..';

export const UsingSolutionsAndITSystemsTable = () => {
  const { t } = useTranslation('usingSolutionsAndITSystemsTable');

  const solutionTableList = tArray<string>(
    'usingSolutionsAndITSystemsTable:solutionTableList'
  );

  const step5List = tArray<string>(
    'usingSolutionsAndITSystemsTable:step5.list'
  );

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
                {t('solutionTable')}
              </h2>

              <p className="margin-y-0">{t('solutionTableDescription')}</p>

              <ul className="margin-y-05">
                {solutionTableList.map((item, index) => (
                  <li key={item} className="margin-0">
                    <Trans
                      t={t}
                      i18nKey={`solutionTableList.${index}`}
                      components={{
                        bold: <span className="text-bold" />
                      }}
                    />
                  </li>
                ))}
              </ul>

              <p className="margin-top-0">{t('solutionTableSubDescription')}</p>

              <h2 className="margin-top-5 margin-bottom-2">
                {t('addingASolution')}
              </h2>

              <p className="margin-y-0">{t('addingASolutionDescription')}</p>

              <h2 className="margin-top-5 margin-bottom-2">
                {t('editingASolution')}
              </h2>

              <p className="margin-top-0">{t('editingASolutionDescription')}</p>

              <ProcessList>
                {/* STEP 1 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step1.heading')}
                  </ProcessListHeading>

                  <p>{t('step1.text')}</p>

                  <img
                    alt={t('step1.altText')}
                    src={CollaborationAreaInProgress}
                    className="border-1px border-gray-10 radius-md shadow-2"
                  />

                  <p>{t('step1.caption')}</p>
                </ProcessListItem>

                {/* STEP 2 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step2.heading')}
                  </ProcessListHeading>

                  <p>{t('step2.text')}</p>

                  <img
                    alt={t('step2.altText')}
                    src={MTOTableTabs}
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

                  <img
                    alt={t('step3.altText')}
                    src={MTOSolutionTableOption}
                    className="border-1px border-gray-10 radius-md shadow-2"
                  />

                  <p>{t('step3.caption')}</p>
                </ProcessListItem>

                {/* STEP 4 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step4.heading')}
                  </ProcessListHeading>

                  <p>{t('step4.text')}</p>
                </ProcessListItem>

                {/* STEP 5 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step5.heading')}
                  </ProcessListHeading>

                  <p className="margin-bottom-0">{t('step5.text')}</p>

                  <ul className="margin-bottom-2">
                    {step5List.map((item, index) => (
                      <li key={item} className="margin-0">
                        <Trans
                          t={t}
                          i18nKey={`step5.list.${index}`}
                          components={{
                            bold: <span className="text-bold" />
                          }}
                        />
                      </li>
                    ))}
                  </ul>

                  <img
                    alt={t('step5.altText')}
                    src={SolutinEditPanel}
                    className="border-1px border-gray-10 radius-md shadow-2"
                  />

                  <p>{t('step5.caption')}</p>
                </ProcessListItem>

                {/* STEP 6 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step6.heading')}
                  </ProcessListHeading>

                  <p>{t('step6.text')}</p>
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

export default UsingSolutionsAndITSystemsTable;
