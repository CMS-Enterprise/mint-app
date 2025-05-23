import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  Icon,
  Link,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import tableActionsAreaImg from 'assets/images/11_Table actions area.png';
import newCategoryModalImg from 'assets/images/21_New category modal.png';
import templateConfirmationModalImg from 'assets/images/22_Template confirmation modal.png';
import collaborationAreaInProgressImg from 'assets/images/33_Collaboration area in progress.png';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import StillNeedMTOHelp from '../_components/StillNeedMTOHelp';
import { ArticleCategories, HelpArticle } from '..';

type TemplatesStep = {
  title: string;
  description: string;
  altText?: string;
  caption?: string;
};
type TemplatesStepWithImg = TemplatesStep & { src?: string };

const UsingTableActions = () => {
  const { t } = useTranslation('usingTableActions');
  const milestonesList = tArray<string>('usingTableActions:milestones:list');
  const categoriesList = tArray<{
    point: string;
    text: string;
  }>('usingTableActions:categories.list');
  const addCustomCategoriesStep4List = tArray<{ point: string; text: string }>(
    'usingTableActions:categories:step4:list'
  );
  const solutionsAndItSystemsList = tArray<string>(
    'usingTableActions:solutionsAndItSystems:list'
  );
  const templatesSteps = tArray<TemplatesStep>(
    'usingTableActions:templates:steps'
  );

  const templatesStepsWithImg: TemplatesStepWithImg[] = templatesSteps.map(
    (step, index) => {
      if (index === 0) {
        return { ...step, src: collaborationAreaInProgressImg };
      }
      if (index === 1) {
        return { ...step, src: tableActionsAreaImg };
      }
      if (index === 3) {
        return { ...step, src: templateConfirmationModalImg };
      }
      return step;
    }
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
              <img
                className="border-1px radius-md border-gray-10 shadow-3"
                src={tableActionsAreaImg}
                alt={t('altText')}
              />
              <p>{t('caption')}</p>

              {/* Milestones */}
              <div>
                <h2 className="margin-bottom-2">{t('milestones.title')}</h2>
                <p className="margin-y-0">{t('milestones.description')}</p>
                <ul className="margin-y-0 padding-left-3">
                  {milestonesList.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <div>
                  <h3 className="margin-bottom-1">
                    {t('milestones.addingMilestonesFromLibrary.title')}
                  </h3>
                  <p className="margin-y-1">
                    {t('milestones.addingMilestonesFromLibrary.description')}
                  </p>
                  <Trans
                    t={t}
                    i18nKey="milestones.addingMilestonesFromLibrary.usingMilestoneLibrary"
                    components={{
                      link1: (
                        <Link
                          href="https://mint.cms.gov"
                          target="_blank"
                          variant="nav"
                        >
                          {' '}
                        </Link>
                      )
                    }}
                  />
                  <Icon.ArrowForward className="margin-left-1 top-05 text-primary" />
                </div>

                <div>
                  <h3 className="margin-bottom-1">
                    {t('milestones.addingCustomMilestone.title')}
                  </h3>
                  <p className="margin-y-1">
                    {t('milestones.addingCustomMilestone.description')}
                  </p>
                  <Trans
                    t={t}
                    i18nKey="milestones.addingCustomMilestone.howToAddCustomMilestone"
                    components={{
                      link1: (
                        <Link
                          href="https://mint.cms.gov"
                          target="_blank"
                          variant="nav"
                        >
                          {' '}
                        </Link>
                      )
                    }}
                  />
                  <Icon.ArrowForward className="margin-left-1 top-05 text-primary" />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h2 className="margin-bottom-2">{t('categories.title')}</h2>
                <p className="margin-y-0">{t('categories.description')}</p>
                <ul className="margin-top-0 padding-left-3">
                  {categoriesList.map(item => (
                    <li key={item.point}>
                      <span className="text-bold">{item.point}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <ProcessList>
                  {/* step 1 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('categories.step1.title')}
                    </ProcessListHeading>
                    <p>{t('categories.step1.description')}</p>
                    <img
                      alt={t('categories.step1.altText')}
                      src={collaborationAreaInProgressImg}
                      className="border-1px border-gray-10 radius-md shadow-3"
                    />
                    <p>{t('categories.step1.caption')}</p>
                  </ProcessListItem>
                  {/* step 2 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('categories.step2.title')}
                    </ProcessListHeading>
                    <p>{t('categories.step2.description')}</p>
                    <img
                      alt={t('categories.step2.altText')}
                      src={tableActionsAreaImg}
                      className="border-1px border-gray-10 radius-md shadow-3"
                    />
                    <p>{t('categories.step2.caption')}</p>
                  </ProcessListItem>
                  {/* step 3 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('categories.step3.title')}
                    </ProcessListHeading>
                    <p>{t('categories.step3.description')}</p>
                  </ProcessListItem>
                  {/* step 4 */}
                  <ProcessListItem className="maxw-none">
                    <ProcessListHeading type="h3">
                      {t('categories.step4.title')}
                    </ProcessListHeading>
                    <p className="margin-bottom-0">
                      {t('categories.step4.description')}
                    </p>
                    <ul className="margin-bottom-2 padding-left-3">
                      {addCustomCategoriesStep4List.map(item => (
                        <li key={item.point}>
                          <span className="text-bold">{item.point}</span>
                          <span>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                    <img
                      alt={t('categories.step4.altText')}
                      src={newCategoryModalImg}
                      className="border-1px border-gray-10 radius-md shadow-3"
                    />
                    <p>{t('categories.step4.caption')}</p>
                  </ProcessListItem>
                  {/* step 5 */}
                  <ProcessListItem className="maxw-none ">
                    <ProcessListHeading type="h3">
                      {t('categories.step5.title')}
                    </ProcessListHeading>
                    <p className="margin-bottom-0">
                      {t('categories.step5.description')}
                    </p>
                  </ProcessListItem>
                </ProcessList>
              </div>

              {/* Solutions and IT systems */}
              <div>
                <div>
                  <h2 className="margin-bottom-2">
                    {t('solutionsAndItSystems.title')}
                  </h2>
                  <p className="margin-y-0">
                    {t('solutionsAndItSystems.description1')}
                  </p>
                  <ul className="margin-y-0 padding-left-3">
                    {solutionsAndItSystemsList.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="margin-top-0">
                    {t('solutionsAndItSystems.description2')}
                  </p>
                  <p>
                    <Trans
                      t={t}
                      i18nKey="solutionsAndItSystems.summary"
                      components={{
                        link1: (
                          <Link
                            href="https://mint.cms.gov"
                            target="_blank"
                            variant="nav"
                          >
                            {' '}
                          </Link>
                        )
                      }}
                    />
                  </p>
                </div>

                <div>
                  <h3 className="margin-bottom-1">
                    {t('solutionsAndItSystems.browsingSolutionLibrary.title')}
                  </h3>
                  <p className="margin-y-1">
                    {t(
                      'solutionsAndItSystems.browsingSolutionLibrary.description'
                    )}
                  </p>
                  <Trans
                    t={t}
                    i18nKey="solutionsAndItSystems.browsingSolutionLibrary.usingSolutionLibrary"
                    components={{
                      link1: (
                        <Link
                          href="https://mint.cms.gov"
                          target="_blank"
                          variant="nav"
                        >
                          {' '}
                        </Link>
                      )
                    }}
                  />
                  <Icon.ArrowForward className="margin-left-1 top-05 text-primary" />
                </div>

                <div>
                  <h3 className="margin-bottom-1">
                    {t('solutionsAndItSystems.addingCustomSolution.title')}
                  </h3>
                  <p className="margin-y-1">
                    {t(
                      'solutionsAndItSystems.addingCustomSolution.description'
                    )}
                  </p>
                  <Trans
                    t={t}
                    i18nKey="solutionsAndItSystems.addingCustomSolution.howToAddCustomSolution"
                    components={{
                      link1: (
                        <Link
                          href="https://mint.cms.gov"
                          target="_blank"
                          variant="nav"
                        >
                          {' '}
                        </Link>
                      )
                    }}
                  />
                  <Icon.ArrowForward className="margin-left-1 top-05 text-primary" />
                </div>
              </div>

              {/* Templates */}
              <div>
                <h2 className="margin-bottom-2">{t('templates.title')}</h2>
                <p>{t('templates.description1')}</p>
                <p className="margin-y-0">{t('templates.description2')}</p>

                <ProcessList>
                  {templatesStepsWithImg.map(step => (
                    <ProcessListItem className="maxw-none ">
                      <ProcessListHeading type="h3">
                        {t(step.title)}
                      </ProcessListHeading>
                      <p className="margin-bottom-0">{t(step.description)}</p>
                      {step.altText && step.src && (
                        <img
                          className="border-1px radius-md border-gray-10 shadow-3"
                          src={step.src}
                          alt={t(step.altText)}
                        />
                      )}
                      {step.caption && <p>{t(step.caption)}</p>}
                    </ProcessListItem>
                  ))}
                </ProcessList>
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
export default UsingTableActions;
