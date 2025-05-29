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

import TableActionsArea from 'assets/images/11_table_actions_area.png';
import NewMilestoneModal from 'assets/images/24_new_milestone_modal.png';
import CollaborationAreaInProgress from 'assets/images/33_collaboration_area_in_progress.png';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import RelatedArticles from '../_components/RelatedArticles';
import StillNeedMTOHelp from '../_components/StillNeedMTOHelp';
import { ArticleCategories, HelpArticle } from '..';

export const SharingAndExportingMTO = () => {
  const { t } = useTranslation('sharingExportingMto');

  const step4List = tArray<string>('sharingExportingMto:step4.list');
  const step4List2 = tArray<string>('sharingExportingMto:step4.list2');

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

              <h2>{t('fromCollabArea')}</h2>

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
                    src={TableActionsArea}
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

                  <ul className="margin-bottom-0">
                    {step4List.map((item, index) => (
                      <li key={item} className="margin-0">
                        <Trans
                          i18nKey={`sharingExportingMto:step4.list.${index}`}
                          components={{
                            bold: <span className="text-bold" />
                          }}
                        />
                      </li>
                    ))}
                  </ul>

                  <p className="margin-y-0">{t('step4.text2')}</p>

                  <ul className="margin-bottom-2">
                    {step4List2.map((item, index) => (
                      <li key={item} className="margin-0">
                        <Trans
                          i18nKey={`sharingExportingMto:step4.list2.${index}`}
                          components={{
                            bold: <span className="text-bold" />
                          }}
                        />
                      </li>
                    ))}
                  </ul>

                  <img
                    alt={t('step4.altText')}
                    src={NewMilestoneModal}
                    className="border-1px border-gray-10 radius-md shadow-2"
                  />

                  <p>{t('step4.caption')}</p>
                </ProcessListItem>

                {/* STEP 5 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step5.heading')}
                  </ProcessListHeading>

                  <p>{t('step5.text')}</p>
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
          HelpArticle.USING_MILESTONE_TABLE,
          HelpArticle.USING_TABLE_ACTIONS
        ]}
        viewAllLink
      />
    </div>
  );
};

export default SharingAndExportingMTO;
