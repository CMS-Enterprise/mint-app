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
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import ExternalLink from 'components/ExternalLink';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import { ArticleCategories, HelpArticle } from '..';

const UsingMilestoneTable = () => {
  const { t } = useTranslation('usingMilestoneTable');
  const columsInMilestoneTableList = tArray<{
    title: string;
    description: string;
  }>('usingMilestoneTable:columsInMilestoneTableList');
  const addingMilestoneList = tArray<string>(
    'usingMilestoneTable:addingMilestoneList'
  );
  const editingMilestoneList = tArray<any>(
    'usingMilestoneTable:editingMilestoneList'
  );
  const removingMilestoneList = tArray<any>(
    'usingMilestoneTable:removingMilestoneList'
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
              <p className="mint-body-large margin-y-1">{t('description')}</p>

              {/* Columns in the milestone table */}
              <div>
                <h2 className="margin-bottom-2">
                  {t('columsInMilestoneTable')}
                </h2>
                <p className="margin-y-0">
                  {t('columsInMilestoneTableDescription')}
                </p>
                <ul className="margin-y-0 padding-left-3">
                  {columsInMilestoneTableList.map(item => (
                    <li key={item.title}>
                      <span className="text-bold">{item.title}</span>
                      <span>{item.description}</span>
                    </li>
                  ))}
                </ul>
                <p className="margin-y-0">
                  {t('columsInMilestoneTableSummary')}
                </p>
              </div>

              {/* Adding a milestone */}
              <div>
                <h2 className="margin-bottom-2">{t('addingMilestone')}</h2>
                <p className="margin-y-0">{t('addingMilestoneDescription')}</p>
                <ul className="margin-top-0 padding-left-3">
                  {addingMilestoneList.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="border-1px radius-md border-gray-10 shadow-3">
                  <img
                    src="/public/help-center/adding-milestone.png"
                    alt="A screenshot of the table actions area and part of the MTO milestone table including an open category row menu."
                  />
                </div>
              </div>
              {/* Editing a milestone */}
              <div>
                <h2 className="margin-bottom-2">{t('editingMilestone')}</h2>
                <p className="margin-y-0">{t('editingMilestoneDescription')}</p>

                <ProcessList>
                  {editingMilestoneList.map(item => (
                    <ProcessListItem key={item.title} className="maxw-none">
                      <ProcessListHeading type="h3">
                        {item.title}
                      </ProcessListHeading>
                      <p>{item.description}</p>
                    </ProcessListItem>
                  ))}
                </ProcessList>
              </div>
              {/* Removing a milestone */}
              <div>
                <h2 className="margin-bottom-2">{t('removingMilestone')}</h2>
                <p className="margin-y-0">
                  {t('removingMilestoneDescription')}
                </p>
                <ProcessList>
                  {removingMilestoneList.map(item => (
                    <ProcessListItem key={item.title} className="maxw-none">
                      <ProcessListHeading type="h3">
                        {item.title}
                      </ProcessListHeading>
                      <p>{item.description}</p>
                    </ProcessListItem>
                  ))}
                </ProcessList>
              </div>
              {/* Adding or removing a category */}
              <div>
                <h2 className="margin-bottom-2">
                  {t('addingOrRemovingCategory')}
                </h2>
                <p className="margin-top-0">
                  {t('addingOrRemovingCategoryDescription')}
                </p>
                <div className="border-1px radius-md border-gray-10 shadow-3">
                  <img
                    src="/public/help-center/adding-removing-category.png"
                    alt="A screenshot of the table actions area and part of the MTO milestone table including an open category row menu."
                  />
                </div>
              </div>
              {/* Organizing categoriesy */}
              <div>
                <h2 className="margin-bottom-2">{t('OrganizingCategories')}</h2>
                <p className="margin-y-0">
                  {t('organizingCategoriesDescription')}
                </p>

                <h3 className="margin-bottom-1">{t('reorderingCategories')}</h3>
                <p className="margin-y-0">
                  {t('reorderingCategoriesDescription')}
                </p>

                <h3 className="margin-bottom-1">{t('renamingCategories')}</h3>
                <p className="margin-y-0">
                  {t('renamingCategoriesDescription')}
                </p>

                <h3 className="margin-bottom-1">
                  {t('ExpandingCollapsingCategories')}
                </h3>
                <p className="margin-y-0">
                  {t('ExpandingCollapsingCategoriesDescription')}
                </p>
              </div>
              {/* Still need help */}
              <div>
                <h2 className="margin-top-5 margin-bottom-2 line-height-large">
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
