import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  Link,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';

import collaborationAreaNotStarted from 'assets/images/01_Collaboration area not started.png';
import emptyMTO from 'assets/images/02_Empty MTO.png';
import MINTHome from 'assets/images/09_MINT home.png';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import HelpCategoryTag from '../_components/HelpCategoryTag';
import RelatedArticles from '../_components/RelatedArticles';
import StillNeedMTOHelp from '../_components/StillNeedMTOHelp';
import { ArticleCategories, HelpArticle } from '..';

export const StartingMTOMatrix = () => {
  const { t } = useTranslation('startingMto');

  const step4List = tArray<string>('startingMto:step4.list');

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
                    {t('step1.heading')}
                  </ProcessListHeading>
                  <p>
                    <Trans
                      t={t}
                      i18nKey="step1.text"
                      components={{
                        link1: (
                          <Link
                            href="https://mint.cms.gov"
                            target="_blank"
                            variant="external"
                          >
                            {' '}
                          </Link>
                        )
                      }}
                    />
                  </p>
                </ProcessListItem>

                {/* STEP 2 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step2.heading')}
                  </ProcessListHeading>

                  <p>{t('step2.text')}</p>

                  <img
                    alt={t('step2.altText')}
                    src={MINTHome}
                    className="border-1px border-base-lightest radius-md shadow-2"
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
                    src={collaborationAreaNotStarted}
                    className="border-1px border-base-lightest radius-md shadow-2"
                  />

                  <p>{t('step3.caption')}</p>
                </ProcessListItem>

                {/* STEP 4 */}
                <ProcessListItem className="maxw-none">
                  <ProcessListHeading type="h3">
                    {t('step4.heading')}
                  </ProcessListHeading>

                  <p>{t('step4.text')}</p>

                  <ul className="margin-bottom-2">
                    {step4List.map(item => (
                      <li key={item} className="margin-0">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <img
                    alt={t('step4.altText')}
                    src={emptyMTO}
                    className="border-1px border-base-lightest radius-md shadow-2"
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
          HelpArticle.USING_SOLUTION_LIBRARY,
          HelpArticle.ADD_CUSTOM_MILESTONE
        ]}
        viewAllLink
      />
    </div>
  );
};

export default StartingMTOMatrix;
