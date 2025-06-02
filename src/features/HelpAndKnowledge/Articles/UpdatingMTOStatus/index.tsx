import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';

import MTOHeaderAreaImg from 'assets/images/12_MTO_header_area.png';
import ReadyForReviewConfirmationImg from 'assets/images/28_ready_for_review_confirmation.png';
import CollaborationAreaInProgressImg from 'assets/images/33_collaboration_area_in_progress.png';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import RelatedArticles from '../_components/RelatedArticles';
import StillNeedMTOHelp from '../_components/StillNeedMTOHelp';
import { ArticleCategories, HelpArticle } from '..';

export const UpdatingMTOStatus = () => {
  const { t } = useTranslation('updatingMtoStatus');
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

              <ProcessList>
                {/* STEP 1 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step1.title')}
                  </ProcessListHeading>
                  <p>{t('step1.description')}</p>
                  <img
                    alt={t('step1.altText')}
                    src={CollaborationAreaInProgressImg}
                    className="border-1px border-gray-10 radius-md shadow-3"
                  />
                  <p>{t('step1.caption')}</p>
                </ProcessListItem>

                {/* STEP 2 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step2.title')}
                  </ProcessListHeading>
                  <p>{t('step2.description')}</p>
                  <img
                    alt={t('step2.altText')}
                    src={MTOHeaderAreaImg}
                    className="border-1px border-gray-10 radius-md shadow-3"
                  />
                  <p>{t('step2.caption')}</p>
                </ProcessListItem>

                {/* STEP 3 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step3.title')}
                  </ProcessListHeading>
                  <p>{t('step3.description')}</p>
                </ProcessListItem>

                {/* STEP 4 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step4.title')}
                  </ProcessListHeading>
                  <p>{t('step4.description')}</p>
                  <img
                    alt={t('step4.altText')}
                    src={ReadyForReviewConfirmationImg}
                    className="border-1px border-gray-10 radius-md shadow-3"
                  />
                  <p>{t('step4.caption')}</p>
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
          HelpArticle.USING_TABLE_ACTIONS,
          HelpArticle.SHARING_EXPORTING_MTO,
          HelpArticle.USING_MILESTONE_LIBRARY
        ]}
        viewAllLink
      />
    </div>
  );
};

export default UpdatingMTOStatus;
