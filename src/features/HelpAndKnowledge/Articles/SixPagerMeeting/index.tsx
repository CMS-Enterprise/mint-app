import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import {
  Grid,
  GridContainer,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';
import { OperationalSolutionKey } from 'gql/generated/graphql';

import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import useModalSolutionState from 'hooks/useModalSolutionState';
import { tArray } from 'utils/translation';

import {
  ArticleCategories,
  covertToLowercaseAndDashes,
  HelpArticle,
  ScrollLink
} from '..';

const SixPagerMeeting = () => {
  const { t: sixPageMeetingT } = useTranslation('sixPageMeeting');

  const location = useLocation();

  const [initLocation] = useState<string>(location.pathname);

  const {
    prevPathname,
    selectedSolution,
    renderModal,
    loading
  } = useModalSolutionState(OperationalSolutionKey.LDG);

  const ldgRoute = `${initLocation}${location.search}${
    location.search ? '&' : '?'
  }solution=learning-and-diffusion-group&section=about`;

  const modelOverviewAndGoals = tArray(
    'sixPageMeeting:conceptPaper.stepOne.items'
  );

  const overviewOfKeyModelDesignElements = tArray(
    'sixPageMeeting:conceptPaper.stepTwo.subitems'
  );

  const alignmentListItems = tArray(
    'sixPageMeeting:conceptPaper.stepThree.alignment.numberedList'
  );

  const impactListItems = tArray(
    'sixPageMeeting:conceptPaper.stepThree.impact.list'
  );

  const stepFour = tArray('sixPageMeeting:conceptPaper.stepFour.items');

  const stepFive = tArray('sixPageMeeting:conceptPaper.stepFive.items');

  const stepSix = tArray('sixPageMeeting:conceptPaper.stepSix.items');

  const stepSeven = tArray('sixPageMeeting:conceptPaper.stepSeven.items');

  const additionalResourcesListItems = tArray(
    'sixPageMeeting:additionalResources.list'
  );

  const additionalResourcesParagraphs = tArray(
    'sixPageMeeting:additionalResources.paragraph'
  );

  const tipsList = tArray('sixPageMeeting:reviewMeeting.subheading.tip.list');

  const outcomesParagraphs = tArray(
    'sixPageMeeting:reviewMeeting.subheading.outcomes.paragraph'
  );

  if (loading) {
    return <PageLoading />;
  }

  return (
    <>
      {renderModal && selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute="/help-and-knowledge/how-to-have-a-successful-6-pager-meeting"
        />
      )}

      <MainContent>
        <GridContainer>
          <Grid>
            <HelpBreadcrumb text={sixPageMeetingT('title')} />

            <PageHeading className="margin-bottom-1">
              {sixPageMeetingT('title')}
            </PageHeading>

            <HelpCategoryTag
              type={ArticleCategories.GETTING_STARTED}
              className="margin-bottom-1"
            />

            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-4">
              {sixPageMeetingT('description')}
            </p>

            <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2">
              <SummaryBoxHeading headingLevel="h3">
                {sixPageMeetingT('summaryBox.title')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <ul className="margin-y-0">
                  {/* eslint-disable jsx-a11y/anchor-is-valid */}
                  <li className="margin-top-05 margin-bottom-1">
                    <ScrollLink
                      scrollTo={sixPageMeetingT('summaryBox.listItem.create')}
                    />
                  </li>
                  <li className="margin-bottom-1">
                    <ScrollLink
                      scrollTo={sixPageMeetingT('summaryBox.listItem.draft')}
                    />
                  </li>
                  <li className="margin-bottom-1">
                    <ScrollLink
                      scrollTo={sixPageMeetingT(
                        'summaryBox.listItem.determine'
                      )}
                    />
                  </li>
                  <li>
                    <ScrollLink
                      scrollTo={sixPageMeetingT('summaryBox.listItem.review')}
                    />
                  </li>
                  {/* eslint-enable jsx-a11y/anchor-is-valid */}
                </ul>
              </SummaryBoxContent>
            </SummaryBox>

            <div
              id={covertToLowercaseAndDashes(
                sixPageMeetingT('summaryBox.listItem.create')
              )}
              className="margin-bottom-0"
            >
              <h2 className="margin-bottom-3">
                {sixPageMeetingT('summaryBox.listItem.create')}
              </h2>
              <p className="margin-top-0 margin-bottom-3 line-height-sans-4">
                {sixPageMeetingT('create.paragraph')}
              </p>
            </div>

            <SummaryBox className="margin-bottom-6">
              <SummaryBoxHeading headingLevel="h3">
                {sixPageMeetingT('startSummaryBox.title')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <UswdsReactLink to="/models/steps-overview">
                  {sixPageMeetingT('startSummaryBox.body')}
                </UswdsReactLink>
              </SummaryBoxContent>
            </SummaryBox>

            <div
              id={covertToLowercaseAndDashes(
                sixPageMeetingT('summaryBox.listItem.draft')
              )}
              className="margin-bottom-6"
            >
              <h2 className="margin-top-0 margin-bottom-3">
                {sixPageMeetingT('summaryBox.listItem.draft')}
              </h2>
              <p className="margin-top-0 margin-bottom-3 line-height-sans-4">
                {sixPageMeetingT('conceptPaper.introParagraph')}
              </p>

              <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2 margin-bottom-3">
                <SummaryBoxHeading headingLevel="h3">
                  {sixPageMeetingT('crossCuttingGroupsSummaryBox.title')}
                </SummaryBoxHeading>
                <SummaryBoxContent>
                  <ul className="margin-y-0">
                    <li>
                      {sixPageMeetingT('crossCuttingGroupsSummaryBox.item.one')}
                    </li>
                    <li>
                      {sixPageMeetingT('crossCuttingGroupsSummaryBox.item.two')}
                    </li>
                    <li>
                      <UswdsReactLink
                        className="usa-button usa-button--unstyled"
                        to={ldgRoute}
                      >
                        {sixPageMeetingT(
                          'crossCuttingGroupsSummaryBox.item.ldg'
                        )}
                      </UswdsReactLink>
                      {sixPageMeetingT(
                        'crossCuttingGroupsSummaryBox.item.learning'
                      )}
                    </li>
                    <li>
                      {sixPageMeetingT(
                        'crossCuttingGroupsSummaryBox.item.four'
                      )}
                    </li>
                    <li>
                      {sixPageMeetingT(
                        'crossCuttingGroupsSummaryBox.item.five'
                      )}
                    </li>
                  </ul>
                </SummaryBoxContent>
              </SummaryBox>

              <div className="margin-bottom-3">
                <h3 className="margin-top-0 margin-bottom-1">
                  {sixPageMeetingT('conceptPaper.stepOne.heading')}
                </h3>
                <ul className="margin-y-0 padding-left-6">
                  {modelOverviewAndGoals.map(k => (
                    <li key={k} className="line-height-sans-4">
                      {k}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="margin-bottom-3">
                <h3 className="margin-top-0 margin-bottom-1">
                  {sixPageMeetingT('conceptPaper.stepTwo.heading')}
                </h3>
                <ul className="margin-y-0 padding-left-6">
                  <li className="line-height-sans-4">
                    {sixPageMeetingT('conceptPaper.stepTwo.item')}
                  </li>
                  <ul className="margin-y-0 padding-left-3">
                    {overviewOfKeyModelDesignElements.map(k => (
                      <li key={k} className="line-height-sans-4">
                        {k}
                      </li>
                    ))}
                  </ul>
                </ul>
              </div>

              <div className="margin-bottom-3">
                <h3 className="margin-top-0 margin-bottom-1">
                  {sixPageMeetingT('conceptPaper.stepThree.heading')}
                </h3>
                <ul className="margin-top-0 padding-left-6">
                  <li className="line-height-sans-4 margin-bottom-05">
                    <strong>
                      {sixPageMeetingT('conceptPaper.stepThree.alignment.bold')}
                    </strong>
                    <span>
                      {sixPageMeetingT('conceptPaper.stepThree.alignment.text')}{' '}
                      <ExternalLink href="https://innovation.cms.gov/strategic-direction">
                        {sixPageMeetingT(
                          'conceptPaper.stepThree.alignment.link'
                        )}
                      </ExternalLink>
                    </span>
                    <ol className="padding-left-3 margin-top-05">
                      {alignmentListItems.map(k => (
                        <li key={k} className="line-height-sans-4">
                          {k}
                        </li>
                      ))}
                    </ol>
                  </li>
                  <li className="line-height-sans-4 margin-bottom-05">
                    <strong>
                      {sixPageMeetingT('conceptPaper.stepThree.impact.bold')}
                    </strong>
                    {sixPageMeetingT('conceptPaper.stepThree.impact.text')}
                    <ul className="padding-left-3 margin-top-05">
                      {impactListItems.map(k => (
                        <li key={k} className="line-height-sans-4">
                          {k}
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="line-height-sans-4 margin-bottom-05">
                    <strong>
                      {sixPageMeetingT(
                        'conceptPaper.stepThree.feasibility.bold'
                      )}
                    </strong>
                    {sixPageMeetingT('conceptPaper.stepThree.feasibility.text')}
                  </li>
                  <li className="line-height-sans-4 margin-bottom-05">
                    <strong>
                      {sixPageMeetingT(
                        'conceptPaper.stepThree.innovation.bold'
                      )}
                    </strong>
                    {sixPageMeetingT('conceptPaper.stepThree.innovation.text')}
                  </li>
                </ul>
              </div>

              <div className="margin-bottom-3">
                <h3 className="margin-top-0 margin-bottom-1">
                  {sixPageMeetingT('conceptPaper.stepFour.heading')}
                </h3>
                <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                  {stepFour.map(k => (
                    <li key={k} className="line-height-sans-4">
                      {k}
                    </li>
                  ))}
                </ul>
              </div>

              <SummaryBox className="margin-bottom-3">
                <SummaryBoxHeading headingLevel="h3">
                  {sixPageMeetingT('tipsSummaryBox.heading')}
                </SummaryBoxHeading>
                <SummaryBoxContent>
                  <ul className="margin-top-1 margin-bottom-0">
                    <li>
                      {sixPageMeetingT('tipsSummaryBox.items.view')}

                      <ExternalLink href="https://share.cms.gov/center/cmmi/QualVert/ModelResources/Forms/AllItems.aspx?RootFolder=%2Fcenter%2Fcmmi%2FQualVert%2FModelResources%2FHealth%20Equity&FolderCTID=0x0120005E561329242B614A92093D06F4EE96E1&View=%7B2B63652B%2D67D7%2D4A43%2DA7CD%2D617DDE639979%7D">
                        {sixPageMeetingT('tipsSummaryBox.items.one')}
                      </ExternalLink>
                    </li>
                    <li>
                      {sixPageMeetingT('tipsSummaryBox.items.view')}
                      <ExternalLink href="https://www.cms.gov/about-cms/agency-information/omh/health-equity-programs/cms-framework-for-health-equity">
                        {sixPageMeetingT('tipsSummaryBox.items.two')}
                      </ExternalLink>
                    </li>
                    <li>{sixPageMeetingT('tipsSummaryBox.items.three')}</li>
                  </ul>
                </SummaryBoxContent>
              </SummaryBox>

              <div className="margin-bottom-3">
                <h3 className="margin-top-0 margin-bottom-1">
                  {sixPageMeetingT('conceptPaper.stepFive.heading')}
                </h3>
                <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                  {stepFive.map(k => (
                    <li key={k} className="line-height-sans-4">
                      {k}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="margin-bottom-3">
                <h3 className="margin-top-0 margin-bottom-1">
                  {sixPageMeetingT('conceptPaper.stepSix.heading')}
                </h3>
                <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                  {stepSix.map(k => (
                    <li key={k} className="line-height-sans-4">
                      {k}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="margin-bottom-3">
                <h3 className="margin-top-0 margin-bottom-1">
                  {sixPageMeetingT('conceptPaper.stepSeven.heading')}
                </h3>
                <p className="padding-left-3 margin-y-0">
                  {sixPageMeetingT('conceptPaper.stepSeven.paragraph')}
                </p>
                <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                  {stepSeven.map(k => (
                    <li key={k} className="line-height-sans-4">
                      {k}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2 margin-y-0">
              <SummaryBoxHeading headingLevel="h3">
                {sixPageMeetingT('conceptPaper.exampleSummaryBox.heading')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <p className="margin-y-1">
                  {sixPageMeetingT('conceptPaper.exampleSummaryBox.paragraph')}
                </p>
                <ul className="margin-top-0">
                  <li>
                    <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/AHEAD%20Concept%20Paper.docx?d=w9bd3973322384706a0207c756f773739">
                      {sixPageMeetingT(
                        'conceptPaper.exampleSummaryBox.items.one'
                      )}
                    </ExternalLink>
                  </li>
                  <li>
                    <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Six%20Pagers/AHEAD%206-page%20concept_Clean.docx?d=wbdf205743dac4ebaa2a99ea37af6b5a7">
                      {sixPageMeetingT(
                        'conceptPaper.exampleSummaryBox.items.two'
                      )}
                    </ExternalLink>
                  </li>
                  <li>
                    <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Six%20Pagers/Enhancing%20Oncology%20Model%20(formerly%20OncT)%206-pager_10252021_clean.docx?d=w1e0f202072d14d8fb64366aff294e415">
                      {sixPageMeetingT(
                        'conceptPaper.exampleSummaryBox.items.three'
                      )}
                    </ExternalLink>
                  </li>
                </ul>
                <span className="margin-y-0">
                  {sixPageMeetingT(
                    'conceptPaper.exampleSummaryBox.footer.copy'
                  )}
                  <ExternalLink href="https://share.cms.gov/center/CMMI/SR/ModelDev/Forms/AllItems.aspx">
                    {sixPageMeetingT(
                      'conceptPaper.exampleSummaryBox.footer.link'
                    )}
                  </ExternalLink>
                </span>
              </SummaryBoxContent>
            </SummaryBox>

            <div
              id={covertToLowercaseAndDashes(
                sixPageMeetingT('summaryBox.listItem.determine')
              )}
              className="margin-bottom-6"
            >
              <h2 className="margin-bottom-3">
                {sixPageMeetingT('summaryBox.listItem.determine')}
              </h2>
              <p className="margin-top-0 margin-bottom-3 line-height-sans-4">
                {sixPageMeetingT('additionalResources.intro')}
              </p>

              <h3 className="margin-top-0 margin-bottom-1">
                {sixPageMeetingT('additionalResources.subheading')}
              </h3>
              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                {additionalResourcesListItems.map(k => (
                  <li key={k} className="line-height-sans-4 margin-bottom-05">
                    {k}
                  </li>
                ))}
              </ul>
              {additionalResourcesParagraphs.map(k => (
                <p
                  key={k}
                  className="line-height-sans-4 margin-top-0 margin-bottom-3"
                >
                  {k}
                </p>
              ))}
            </div>

            <div
              id={covertToLowercaseAndDashes(
                sixPageMeetingT('summaryBox.listItem.review')
              )}
              className="margin-bottom-6"
            >
              <h2 className="margin-bottom-3">
                {sixPageMeetingT('summaryBox.listItem.review')}
              </h2>
              <p className="margin-top-0 margin-bottom-3 line-height-sans-4">
                {sixPageMeetingT('reviewMeeting.intro')}
                <i>{sixPageMeetingT('reviewMeeting.italicsNowWhat')}</i>
              </p>

              <h3 className="margin-top-0 margin-bottom-1">
                {sixPageMeetingT('reviewMeeting.subheading.tip.text')}
              </h3>
              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                {tipsList.map(k => (
                  <li key={k} className="line-height-sans-4 margin-bottom-05">
                    {k}
                  </li>
                ))}
              </ul>

              <h3 className="margin-top-0 margin-bottom-1">
                {sixPageMeetingT('reviewMeeting.subheading.outcomes.text')}
              </h3>
              {outcomesParagraphs.map(k => (
                <p
                  key={k}
                  className="line-height-sans-4 margin-top-0 margin-bottom-3"
                >
                  {k}
                </p>
              ))}
            </div>

            <SummaryBox>
              <SummaryBoxHeading headingLevel="h3">
                {sixPageMeetingT('footerSummaryBox.title')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <Trans i18nKey="sixPageMeeting:footerSummaryBox.body">
                  indexZero
                  <ExternalLink href="mailto:MINTTeam@cms.hhs.gov">
                    email
                  </ExternalLink>
                  indexTwo
                </Trans>
              </SummaryBoxContent>
            </SummaryBox>
          </Grid>
        </GridContainer>
      </MainContent>
      <div className="margin-top-6 margin-bottom-neg-7">
        <RelatedArticles
          currentArticle={HelpArticle.SIX_PAGER_MEETING}
          specificArticles={[
            HelpArticle.TWO_PAGER_MEETING,
            HelpArticle.HIGH_LEVEL_PROJECT_PLAN,
            HelpArticle.SAMPLE_MODEL_PLAN
          ]}
          viewAllLink
        />
      </div>
    </>
  );
};

export default SixPagerMeeting;
