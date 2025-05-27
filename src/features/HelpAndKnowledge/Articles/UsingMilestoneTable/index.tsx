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
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import milestoneTableMenuImg from 'assets/images/03_Milestone table menu open.png';
import milestoneEditPanelImg from 'assets/images/08_Milestone edit panel.png';
import mtoMilestoneTableOption1Img from 'assets/images/10_MTO milestone table_option 1.png';
import milestoneRemovalModalImg from 'assets/images/15_Milestone removal modal.png';
import milestoneRemovalButtonImg from 'assets/images/17_Milestone removal button.png';
import collaborationAreaInProgressImg from 'assets/images/33_Collaboration area in progress.png';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import StillNeedMTOHelp from '../_components/StillNeedMTOHelp';
import { ArticleCategories, HelpArticle } from '..';

import './index.scss';

const UsingMilestoneTable = () => {
  const { t } = useTranslation('usingMilestoneTable');
  const columsInMilestoneTableList = tArray<string>(
    'usingMilestoneTable:columsInMilestoneTable:list'
  );
  const addingMilestoneList = tArray<string>(
    'usingMilestoneTable:addingMilestone:list'
  );
  const editingMilestoneStep4List = tArray<string>(
    'usingMilestoneTable:editingMilestone.step4.list'
  );
  const organizingCategoriesList = tArray<{
    point: string;
    text: string;
  }>('usingMilestoneTable:organizingCategories:list');

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

              {/* Columns in the milestone table */}
              <div>
                <h2 className="margin-top-0 margin-bottom-2">
                  {t('columsInMilestoneTable.title')}
                </h2>
                <p className="margin-y-0">
                  {t('columsInMilestoneTable.description')}
                </p>
                <ul className="margin-y-0 padding-left-3">
                  {columsInMilestoneTableList.map((item, index) => (
                    <li key={item} className="margin-0">
                      <Trans
                        t={t}
                        i18nKey={`usingMilestoneTable:columsInMilestoneTable:list.${index}`}
                        components={{
                          bold: <span className="text-bold" />
                        }}
                      />
                    </li>
                  ))}
                </ul>
                <p className="margin-top-0">
                  {t('columsInMilestoneTableSummary')}
                </p>
              </div>

              {/* Adding a milestone */}
              <div>
                <h2 className="margin-top-5 margin-bottom-2">
                  {t('addingMilestone.title')}
                </h2>
                <p className="margin-y-0">{t('addingMilestone.description')}</p>
                <ul className="margin-top-0 padding-left-3">
                  {addingMilestoneList.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div className="border-1px radius-md border-gray-10 shadow-3">
                  <img
                    src={milestoneTableMenuImg}
                    alt={t('addingMilestone.altText')}
                  />
                </div>
                <p>{t('addingMilestone.caption')}</p>
              </div>
              {/* Editing a milestone */}
              <div>
                <h2 className="margin-top-5 margin-bottom-2">
                  {t('editingMilestone.title')}
                </h2>
                <p className="margin-y-0">
                  {t('editingMilestone.description')}
                </p>
                <ProcessList>
                  {/* step 1 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('editingMilestone.step1.title')}
                    </ProcessListHeading>
                    <p>{t('editingMilestone.step1.description')}</p>
                    <img
                      alt={t('editingMilestone.step1.altText')}
                      src={collaborationAreaInProgressImg}
                      className="border-1px border-gray-10 radius-md shadow-3"
                    />
                    <p>{t('editingMilestone.step1.caption')}</p>
                  </ProcessListItem>

                  {/* step 2 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('editingMilestone.step2.title')}
                    </ProcessListHeading>
                    <p>{t('editingMilestone.step2.description')}</p>
                    <img
                      alt={t('editingMilestone.step2.altText')}
                      src={mtoMilestoneTableOption1Img}
                      className="border-1px border-gray-10 radius-md shadow-3"
                    />
                    <p>{t('editingMilestone.step2.caption')}</p>
                  </ProcessListItem>

                  {/* step 3 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('editingMilestone.step3.title')}
                    </ProcessListHeading>
                    <p>{t('editingMilestone.step3.description')}</p>
                  </ProcessListItem>

                  {/* step 4 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('editingMilestone.step4.title')}
                    </ProcessListHeading>
                    <p className="margin-bottom-0">
                      {t('editingMilestone.step4.description')}
                    </p>
                    <ul className="margin-bottom-2 padding-left-3">
                      {editingMilestoneStep4List.map((item, index) => (
                        <li key={item}>
                          <Trans
                            t={t}
                            i18nKey={`usingMilestoneTable:editingMilestone.step4.list.${index}`}
                            components={{
                              bold: <span className="text-bold" />
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                    <img
                      alt={t('editingMilestone.step4.altText')}
                      src={milestoneEditPanelImg}
                      className="border-1px border-gray-10 radius-md shadow-3"
                    />
                    <p>{t('editingMilestone.step4.caption')}</p>
                  </ProcessListItem>

                  {/* step 5 */}
                  <ProcessListItem className="maxw-none padding-bottom-0">
                    <ProcessListHeading type="h3">
                      {t('editingMilestone.step5.title')}
                    </ProcessListHeading>
                    <p>{t('editingMilestone.step5.description')}</p>
                  </ProcessListItem>
                </ProcessList>
              </div>

              {/* Removing a milestone */}
              <div>
                <h2 className="margin-top-5 margin-bottom-2">
                  {t('removingMilestone.title')}
                </h2>
                <p className="margin-y-0">
                  {t('removingMilestone.description')}
                </p>
                {/* ol start number is set in class skipStepsList via css */}
                <ProcessList className="skipStepsList">
                  {/* step 1-3 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('removingMilestone.step1to3.title')}
                    </ProcessListHeading>
                    <p>{t('removingMilestone.step1to3.description')}</p>
                  </ProcessListItem>

                  {/* step 4 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('removingMilestone.step4.title')}
                    </ProcessListHeading>
                    <p>{t('removingMilestone.step4.description')}</p>
                    <img
                      alt={t('removingMilestone.step4.altText')}
                      src={milestoneRemovalButtonImg}
                      className="border-1px border-gray-10 radius-md shadow-3"
                    />
                    <p>{t('removingMilestone.step4.caption')}</p>
                  </ProcessListItem>

                  {/* step 5 */}
                  <ProcessListItem className="maxw-none padding-bottom-0">
                    <ProcessListHeading type="h3">
                      {t('removingMilestone.step5.title')}
                    </ProcessListHeading>
                    <p>{t('removingMilestone.step5.description')}</p>
                    <img
                      alt={t('removingMilestone.step5.altText')}
                      src={milestoneRemovalModalImg}
                      className="border-1px border-gray-10 radius-md shadow-3"
                    />
                    <p>{t('removingMilestone.step5.caption')}</p>
                  </ProcessListItem>
                </ProcessList>
              </div>
              {/* Adding or removing a category */}
              <div>
                <h2 className="margin-top-5 margin-bottom-2">
                  {t('addingOrRemovingCategory.title')}
                </h2>
                <p className="margin-top-0">
                  {t('addingOrRemovingCategory.description')}
                </p>
                <div className="border-1px radius-md border-gray-10 shadow-3">
                  <img
                    src={milestoneTableMenuImg}
                    alt={t('addingOrRemovingCategory.altText')}
                  />
                </div>
                <p>{t('addingOrRemovingCategory.caption')}</p>
              </div>
              {/* Organizing categoriesy */}
              <div>
                <h2 className="margin-top-5 margin-bottom-2">
                  {t('organizingCategories.title')}
                </h2>
                <p className="margin-y-0">
                  {t('organizingCategories.description')}
                </p>

                {organizingCategoriesList.map(item => (
                  <div key={item.point}>
                    <h3 className="margin-bottom-1">{t(item.point)}</h3>
                    <p className="margin-y-0">{t(item.text)}</p>
                  </div>
                ))}
              </div>

              {/* Still need help */}
              <StillNeedMTOHelp />
            </div>
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle={HelpArticle.USING_MILESTONE_TABLE}
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
export default UsingMilestoneTable;
