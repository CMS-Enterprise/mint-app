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

import MINTHome from 'assets/images/09_MINT_home.png';
import MINTTopTabs from 'assets/images/14_MINT_top_tabs.png';
import ShareModal from 'assets/images/29_share_modal.png';
import ExportModal from 'assets/images/30_export_modal.png';
import ModelsTabOption1 from 'assets/images/31_models_tab_option_1.png';
import ReadViewModelHeader from 'assets/images/32_read_view_model_header.png';
import CollaborationAreaInProgress from 'assets/images/33_collaboration_area_in_progress.png';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import LatestContentUpdate from '../_components/LatestContentUpdate';
import RelatedArticles from '../_components/RelatedArticles';
import StillNeedMTOHelp from '../_components/StillNeedMTOHelp';
import { ArticleCategories, HelpArticle } from '..';

export const SharingAndExportingMTO = () => {
  const { t } = useTranslation('sharingExportingMto');

  const step4List = tArray<string>('sharingExportingMto:step4.list');
  const step4List2 = tArray<string>('sharingExportingMto:step4.list2');
  const readViewStepList = tArray<string>(
    'sharingExportingMto:readViewStep4.list'
  );
  const readViewStepList2 = tArray<string>(
    'sharingExportingMto:readViewStep4.list2'
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

              {/* From the collab area */}
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
                    src={MINTHome}
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
                    src={CollaborationAreaInProgress}
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
                    src={ShareModal}
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

              {/* From the read view */}
              <h2>{t('fromReadView')}</h2>

              <ProcessList>
                {/* STEP 1 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('readViewStep1.heading')}
                  </ProcessListHeading>

                  <p>{t('readViewStep1.text')}</p>

                  <img
                    alt={t('readViewStep1.altText')}
                    src={MINTTopTabs}
                    className="border-1px border-gray-10 radius-md shadow-2"
                  />

                  <p>{t('readViewStep1.caption')}</p>
                </ProcessListItem>

                {/* STEP 2 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('readViewStep2.heading')}
                  </ProcessListHeading>

                  <p>{t('readViewStep2.text')}</p>

                  <img
                    alt={t('readViewStep2.altText')}
                    src={ModelsTabOption1}
                    className="border-1px border-gray-10 radius-md shadow-2"
                  />

                  <p>{t('readViewStep2.caption')}</p>
                </ProcessListItem>

                {/* STEP 3 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('readViewStep3.heading')}
                  </ProcessListHeading>

                  <p>{t('readViewStep3.text')}</p>

                  <img
                    alt={t('readViewStep3.altText')}
                    src={ReadViewModelHeader}
                    className="border-1px border-gray-10 radius-md shadow-2"
                  />

                  <p>{t('readViewStep3.caption')}</p>
                </ProcessListItem>

                {/* STEP 4 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('readViewStep4.heading')}
                  </ProcessListHeading>

                  <p className="margin-bottom-0">{t('readViewStep4.text')}</p>

                  <ul className="margin-bottom-0">
                    {readViewStepList.map((item, index) => (
                      <li key={item} className="margin-0">
                        <Trans
                          i18nKey={`sharingExportingMto:readViewStep4.list.${index}`}
                          components={{
                            bold: <span className="text-bold" />
                          }}
                        />
                      </li>
                    ))}
                  </ul>

                  <p className="margin-y-0">{t('readViewStep4.text2')}</p>

                  <ul className="margin-bottom-2">
                    {readViewStepList2.map((item, index) => (
                      <li key={item} className="margin-0">
                        <Trans
                          i18nKey={`sharingExportingMto:readViewStep4.list2.${index}`}
                          components={{
                            bold: <span className="text-bold" />
                          }}
                        />
                      </li>
                    ))}
                  </ul>

                  <img
                    alt={t('readViewStep4.altText')}
                    src={ExportModal}
                    className="border-1px border-gray-10 radius-md shadow-2"
                  />

                  <p>{t('readViewStep4.caption')}</p>
                </ProcessListItem>

                {/* STEP 5 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('readViewStep5.heading')}
                  </ProcessListHeading>

                  <p>{t('readViewStep5.text')}</p>
                </ProcessListItem>
              </ProcessList>

              <StillNeedMTOHelp />

              <LatestContentUpdate file="sharingExportingMto.ts" />
            </div>
          </Grid>
        </GridContainer>
      </MainContent>

      <RelatedArticles
        currentArticle={HelpArticle.STARTING_MTO}
        specificArticles={[
          HelpArticle.USING_TABLE_ACTIONS,
          HelpArticle.UPDATING_MTO_STATUS,
          HelpArticle.STARTING_MTO
        ]}
        viewAllLink
      />
    </div>
  );
};

export default SharingAndExportingMTO;
