import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
import { findSolutionByRouteParam } from 'features/HelpAndKnowledge/SolutionsHelp';
import SolutionDetailsModal from 'features/HelpAndKnowledge/SolutionsHelp/SolutionDetails/Modal';

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import ScrollLink from 'components/ScrollLink';
import useHelpSolution from 'hooks/useHelpSolutions';
import useModalSolutionState from 'hooks/useModalSolutionState';
import { getKeys } from 'types/translation';
import { tArray, tObject } from 'utils/translation';

import KeyResourcesCards from '../_components/KeyResourcesCards';
import ModelSectionCriteriaTable from '../_components/ModelSelectionCriteriaTable';
import NeedHelp from '../_components/NeedHelp';
import { ArticleCategories, HelpArticle } from '..';

export const convertToLowercaseAndDashes = (string: string) =>
  string.toLowerCase().replace(/\s+/g, '-');

type ExampleSummaryBoxListType = {
  [key: string]: {
    href: string;
    copy: string;
  };
};

type StepThreeListType = {
  text: string;
  numberedList?: string[];
  list?: string[];
};

const TwoPagerMeeting = () => {
  const { t: twoPageMeetingT } = useTranslation('twoPageMeeting');

  const summaryboxListItems: string[] = tArray(
    'twoPageMeeting:summaryBox.list'
  );

  const briefItems = tArray<string>(
    'twoPageMeeting:about.stepOne.items.brief.list'
  );

  const aboutTipsList1: string[] = tArray(
    'twoPageMeeting:about.summarybox.tips.list1'
  );

  const aboutTipsList2: string[] = tArray(
    'twoPageMeeting:about.summarybox.tips.list2'
  );

  const contractorParagraphs: string[] = tArray(
    'twoPageMeeting:additionalResources.contractorParagraph'
  );

  const additionalResourceTips: string[] = tArray(
    'twoPageMeeting:additionalResources.summarybox.tips.list'
  );

  const crossCutListItems: string[] = tArray(
    'twoPageMeeting:additionalResources.crossCut.list'
  );

  const reviewTipsList: string[] = tArray(
    'twoPageMeeting:reviewMeeting.tipbox.list'
  );

  const outcomesList: string[] = tArray(
    'twoPageMeeting:reviewMeeting.outcomes.list'
  );

  const exampleSummaryBoxList: ExampleSummaryBoxListType = tObject(
    'twoPageMeeting:about.summarybox.exampleSummaryBox.list'
  );

  const stepThreeList: StepThreeListType[] = tArray(
    'twoPageMeeting:about.stepThree.list'
  );

  const { helpSolutions } = useHelpSolution();
  const { prevPathname, selectedSolution: solution } =
    useModalSolutionState(null);

  // Solution to render in modal
  const selectedSolution = findSolutionByRouteParam(
    solution?.route || null,
    helpSolutions
  );

  return (
    <>
      {selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute="help-and-knowledge/about-2-page-concept-papers-and-review-meetings"
        />
      )}
      <MainContent>
        <GridContainer>
          <Grid>
            <HelpBreadcrumb text={twoPageMeetingT('title')} />
            <PageHeading className="margin-bottom-1">
              {twoPageMeetingT('title')}
            </PageHeading>
            <HelpCategoryTag
              type={ArticleCategories.MODEL_CONCEPT_AND_DESIGN}
              className="margin-bottom-1"
            />
            <p className="mint-body-large line-height-large margin-top-0 margin-bottom-4">
              {twoPageMeetingT('description')}
            </p>

            <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2">
              <SummaryBoxHeading headingLevel="h3">
                {twoPageMeetingT('summaryBox.title')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <ul className="margin-y-0">
                  {summaryboxListItems.map(k => (
                    <li
                      key={convertToLowercaseAndDashes(k)}
                      className="margin-top-05 margin-bottom-1"
                    >
                      <ScrollLink scrollTo={k} />
                    </li>
                  ))}
                </ul>
              </SummaryBoxContent>
            </SummaryBox>

            <div
              id={convertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.list.0')
              )}
              className="margin-bottom-5 scroll-target"
            >
              <h2 className="margin-bottom-3">
                {twoPageMeetingT('summaryBox.list.0')}
              </h2>

              <p className="margin-top-0 margin-bottom-3 line-height-normal">
                {twoPageMeetingT('keyResources.introParagraph')}
              </p>

              <KeyResourcesCards />
            </div>

            <div
              id={convertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.list.1')
              )}
              className="margin-bottom-5 scroll-target"
            >
              <h2 className="margin-bottom-3">
                {twoPageMeetingT('summaryBox.list.1')}
              </h2>

              <p className="margin-top-0 margin-bottom-3 line-height-normal">
                {twoPageMeetingT('about.introParagraph')}
              </p>

              <Alert type="info" className="margin-y-3">
                <div style={{ whiteSpace: 'pre' }}>
                  <Trans
                    i18nKey="sixPageMeeting:paperTemplateAlert"
                    components={{
                      link1: (
                        <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Model%20and%20Initiative%20Templates/2024%20Model%20Templates/Model%20Development%202-pager%20Template%205.24%20CLEAN.docx">
                          {' '}
                        </ExternalLink>
                      )
                    }}
                  />
                </div>
              </Alert>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('about.stepOne.heading')}
              </h3>

              <p className="padding-left-3 margin-bottom-0 line-height-normal">
                {twoPageMeetingT('about.stepOne.copy')}
              </p>

              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                <li className="line-height-normal">
                  {twoPageMeetingT('about.stepOne.items.brief.text')}
                  <ul
                    className="margin-top-0 padding-left-2"
                    style={{ listStyleType: 'disc' }}
                  >
                    {briefItems.map(k => (
                      <li key={k} className="line-height-normal">
                        {k}
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="line-height-normal">
                  {twoPageMeetingT('about.stepOne.items.describe')}
                </li>

                <li className="line-height-normal">
                  {twoPageMeetingT('about.stepOne.items.include')}
                </li>

                <li className="line-height-normal">
                  {twoPageMeetingT('about.stepOne.items.provide')}
                </li>
              </ul>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('about.stepTwo.heading')}
              </h3>

              <p className="padding-left-3 margin-bottom-0 line-height-normal">
                {twoPageMeetingT('about.stepTwo.copy')}
              </p>

              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                <li className="line-height-normal">
                  {twoPageMeetingT('about.stepTwo.item')}
                </li>
              </ul>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('about.stepThree.heading')}
              </h3>

              <i className="display-block margin-top-0 margin-bottom-1 padding-left-3">
                {twoPageMeetingT('about.stepThree.italics')}
              </i>

              <p className="padding-left-3 margin-bottom-0 line-height-normal">
                <Trans
                  t={twoPageMeetingT}
                  i18nKey="about.stepThree.copy"
                  components={{
                    bold: <strong />
                  }}
                />
              </p>
              <ul className="margin-top-0 margin-bottom-5 padding-left-6">
                {Object.values(stepThreeList).map(k => (
                  <li
                    key={convertToLowercaseAndDashes(k.text)}
                    className="line-height-normal margin-bottom-05"
                  >
                    <Trans
                      t={twoPageMeetingT}
                      i18nKey={k.text}
                      components={{
                        bold: <strong />
                      }}
                    />

                    {k.numberedList && (
                      <ol className="padding-left-3 margin-top-05">
                        {k.numberedList.map(listItem => (
                          <li
                            key={convertToLowercaseAndDashes(listItem)}
                            className="line-height-normal"
                          >
                            {listItem}
                          </li>
                        ))}
                      </ol>
                    )}

                    {k.list && (
                      <ul className="padding-left-3 margin-top-05">
                        {k.list.map(listItem => (
                          <li
                            key={convertToLowercaseAndDashes(listItem)}
                            className="line-height-normal"
                          >
                            {listItem}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>

              <SummaryBox className="padding-3 margin-bottom-3">
                <SummaryBoxHeading
                  headingLevel="h3"
                  className="margin-bottom-2"
                >
                  {twoPageMeetingT('about.summarybox.tips.heading')}
                </SummaryBoxHeading>

                <SummaryBoxContent>
                  <p className="margin-y-0">
                    {twoPageMeetingT('about.summarybox.tips.firstParagraph')}
                  </p>

                  <ul className="margin-y-0 padding-left-6">
                    {aboutTipsList1.map(k => (
                      <li key={k} className="line-height-normal">
                        {k}
                      </li>
                    ))}
                  </ul>

                  <p className="margin-y-0">
                    {twoPageMeetingT('about.summarybox.tips.secondParagraph')}
                  </p>

                  <ul className="margin-top-0 margin-bottom-2 padding-left-6">
                    {aboutTipsList2.map(k => (
                      <li key={k} className="line-height-normal">
                        {k}
                      </li>
                    ))}
                  </ul>

                  <p className="margin-y-0">
                    <Trans
                      t={twoPageMeetingT}
                      i18nKey="about.summarybox.tips.footer"
                      components={{
                        bold: (
                          <ExternalLink
                            className="margin-right-0"
                            href="https://share.cms.gov/center/cmmi/SR/SitePages/Home.aspx"
                          />
                        )
                      }}
                    />
                  </p>
                </SummaryBoxContent>
              </SummaryBox>

              <SummaryBox className="padding-3 border-gray-10 bg-white shadow-2">
                <SummaryBoxHeading headingLevel="h3">
                  {twoPageMeetingT(
                    'about.summarybox.exampleSummaryBox.heading'
                  )}
                </SummaryBoxHeading>

                <SummaryBoxContent>
                  <p className="margin-y-1">
                    {twoPageMeetingT('about.summarybox.exampleSummaryBox.text')}
                  </p>

                  <ul className="margin-top-0">
                    {getKeys(exampleSummaryBoxList).map(k => (
                      <li key={k} className="margin-bottom-1">
                        <ExternalLink href={exampleSummaryBoxList[k].href}>
                          {exampleSummaryBoxList[k].copy}
                        </ExternalLink>
                      </li>
                    ))}
                  </ul>

                  <span className="margin-y-0">
                    {twoPageMeetingT(
                      'about.summarybox.exampleSummaryBox.footer'
                    )}
                    <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/AHEAD%20Concept%20Paper.docx?d=w9bd3973322384706a0207c756f773739">
                      {twoPageMeetingT(
                        'about.summarybox.exampleSummaryBox.footerLink'
                      )}
                    </ExternalLink>
                  </span>
                </SummaryBoxContent>
              </SummaryBox>
            </div>

            <div
              id={convertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.list.2')
              )}
              className="margin-bottom-5 scroll-target"
            >
              <h2 className="margin-bottom-3">
                {twoPageMeetingT('summaryBox.list.2')}
              </h2>

              <p className="margin-top-0 margin-bottom-3 line-height-normal">
                {twoPageMeetingT('additionalResources.intro')}
              </p>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('additionalResources.contractor')}
              </h3>

              {contractorParagraphs.map(k => (
                <p
                  key={k}
                  className="line-height-normal margin-top-0 margin-bottom-3"
                >
                  {k}
                </p>
              ))}

              <SummaryBox className="padding-3 margin-bottom-3">
                <SummaryBoxHeading
                  headingLevel="h3"
                  className="margin-bottom-2"
                >
                  {twoPageMeetingT(
                    'additionalResources.summarybox.tips.heading'
                  )}
                </SummaryBoxHeading>

                <SummaryBoxContent>
                  <p className="margin-y-0">
                    {twoPageMeetingT(
                      'additionalResources.summarybox.tips.firstParagraph'
                    )}
                  </p>

                  <ul className="margin-y-0 padding-left-6">
                    {additionalResourceTips.map(k => (
                      <li key={k} className="line-height-normal">
                        {k}
                      </li>
                    ))}
                  </ul>

                  <p className="margin-y-0">
                    {twoPageMeetingT(
                      'additionalResources.summarybox.tips.footer'
                    )}
                  </p>
                </SummaryBoxContent>
              </SummaryBox>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('additionalResources.crossCut.heading')}
              </h3>

              <p className="line-height-normal margin-y-0">
                {twoPageMeetingT('additionalResources.crossCut.copy')}
              </p>

              <ul className="margin-y-0 padding-left-6">
                {crossCutListItems.map(k => (
                  <li key={k} className="line-height-normal">
                    <Trans
                      i18nKey={k}
                      components={{
                        ml: (
                          <UswdsReactLink
                            className="usa-button usa-button--unstyled"
                            to="?solution=learning-and-diffusion-group&section=about"
                          >
                            {k}
                          </UswdsReactLink>
                        )
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div
              id={convertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.list.3')
              )}
              className="margin-bottom-5 scroll-target"
            >
              <h2 className="margin-bottom-3">
                {twoPageMeetingT('summaryBox.list.3')}
              </h2>

              <p className="margin-top-0 margin-bottom-3 line-height-normal">
                {twoPageMeetingT('reviewMeeting.intro')}
              </p>

              <SummaryBox className="padding-3 margin-bottom-3">
                <SummaryBoxHeading
                  headingLevel="h3"
                  className="margin-bottom-2"
                >
                  {twoPageMeetingT(
                    'additionalResources.summarybox.tips.heading'
                  )}
                </SummaryBoxHeading>

                <SummaryBoxContent>
                  <p className="margin-y-0">
                    {twoPageMeetingT('reviewMeeting.tipbox.copy')}
                  </p>

                  <ul className="margin-y-0 padding-left-3">
                    {reviewTipsList.map(k => (
                      <li key={k} className="line-height-normal">
                        {k}
                      </li>
                    ))}
                  </ul>
                </SummaryBoxContent>
              </SummaryBox>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('reviewMeeting.criteria.heading')}
              </h3>
              <p className="margin-y-0 line-height-normal">
                {twoPageMeetingT('reviewMeeting.criteria.copy')}
              </p>

              <ModelSectionCriteriaTable />

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('reviewMeeting.outcomes.heading')}
              </h3>

              <p className="margin-y-0 line-height-normal">
                {twoPageMeetingT('reviewMeeting.outcomes.copy')}
              </p>

              <ul className="margin-y-0 padding-left-3">
                {outcomesList.map(k => (
                  <li key={k} className="line-height-normal">
                    <Trans
                      i18nKey={k}
                      components={{
                        bold: <strong />
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <NeedHelp />
          </Grid>
        </GridContainer>
      </MainContent>

      <div className="margin-top-6 margin-bottom-neg-7">
        <RelatedArticles
          currentArticle={HelpArticle.TWO_PAGER_MEETING}
          specificArticles={[
            HelpArticle.SIX_PAGER_MEETING,
            HelpArticle.HIGH_LEVEL_PROJECT_PLAN,
            HelpArticle.SAMPLE_MODEL_PLAN
          ]}
          viewAllLink
        />
      </div>
    </>
  );
};

export default TwoPagerMeeting;
