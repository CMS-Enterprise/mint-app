import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Grid,
  GridContainer,
  IconArrowForward,
  Link as ExternalLink,
  SummaryBox
} from '@trussworks/react-uswds';

import HelpAndKnowledgeCategoryTag from 'components/HelpAndKnowledgeCategoryTag';
import HelpBreadcrumb from 'components/HelpBreadcrumb';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RelatedArticles from 'components/RelatedArticles';

const covertToLowercaseAndDashes = (string: string) =>
  string.toLowerCase().replace(/\s+/g, '-');

const Link = ({ scrollTo }: { scrollTo: string }) => {
  return (
    <a
      href={`#${covertToLowercaseAndDashes(scrollTo)}`}
      className="display-flex flex-align-center"
    >
      {scrollTo}
      <IconArrowForward />
    </a>
  );
};

const TwoPagerMeeting = () => {
  const { t: twoPageMeetingT } = useTranslation('twoPageMeeting');

  const modelOverviewAndGoals: string[] = twoPageMeetingT(
    'conceptPaper.stepOne.items',
    { returnObjects: true }
  );

  const alignmentListItems: string[] = twoPageMeetingT(
    'conceptPaper.stepThree.alignment.numberedList',
    { returnObjects: true }
  );

  const impactListItems: string[] = twoPageMeetingT(
    'conceptPaper.stepThree.impact.list',
    { returnObjects: true }
  );
  const additionalResourcesListItems: string[] = twoPageMeetingT(
    'additionalResources.list',
    { returnObjects: true }
  );
  const additionalResourcesParagraphs: string[] = twoPageMeetingT(
    'additionalResources.paragraph',
    { returnObjects: true }
  );
  const tipsList: string[] = twoPageMeetingT(
    'reviewMeeting.subheading.tip.list',
    { returnObjects: true }
  );
  const outcomesParagraphs: string[] = twoPageMeetingT(
    'reviewMeeting.subheading.outcomes.paragraph',
    { returnObjects: true }
  );

  return (
    <>
      <MainContent>
        <GridContainer>
          <Grid>
            <HelpBreadcrumb text={twoPageMeetingT('title')} />
            <PageHeading className="margin-bottom-1">
              {twoPageMeetingT('title')}
            </PageHeading>
            <HelpAndKnowledgeCategoryTag
              type="gettingStarted"
              className="margin-bottom-1"
            />
            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-4">
              {twoPageMeetingT('description')}
            </p>

            <SummaryBox
              heading={twoPageMeetingT('summaryBox.title')}
              className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2"
            >
              <ul className="margin-y-0">
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                <li className="margin-top-05 margin-bottom-1">
                  <Link
                    scrollTo={twoPageMeetingT('summaryBox.listItem.draft')}
                  />
                </li>
                <li className="margin-bottom-1">
                  <Link
                    scrollTo={twoPageMeetingT('summaryBox.listItem.start')}
                  />
                </li>
                <li>
                  <Link
                    scrollTo={twoPageMeetingT('summaryBox.listItem.review')}
                  />
                </li>
                {/* eslint-enable jsx-a11y/anchor-is-valid */}
              </ul>
            </SummaryBox>

            <div
              id={covertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.listItem.draft')
              )}
              className="margin-bottom-6"
            >
              <PageHeading className="margin-bottom-3" headingLevel="h2">
                {twoPageMeetingT('summaryBox.listItem.draft')}
              </PageHeading>
              <p className="margin-top-0 margin-bottom-3 line-height-sans-4">
                {twoPageMeetingT('conceptPaper.introParagraph')}
              </p>

              <PageHeading
                className="margin-top-0 margin-bottom-1"
                headingLevel="h3"
              >
                {twoPageMeetingT('conceptPaper.stepOne.heading')}
              </PageHeading>
              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                {modelOverviewAndGoals.map(k => (
                  <li key={k} className="line-height-sans-4">
                    {k}
                  </li>
                ))}
              </ul>

              <PageHeading
                className="margin-top-0 margin-bottom-1"
                headingLevel="h3"
              >
                {twoPageMeetingT('conceptPaper.stepTwo.heading')}
              </PageHeading>
              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                <li className="line-height-sans-4">
                  {twoPageMeetingT('conceptPaper.stepTwo.item')}
                </li>
              </ul>

              <PageHeading
                className="margin-top-0 margin-bottom-1"
                headingLevel="h3"
              >
                {twoPageMeetingT('conceptPaper.stepThree.heading')}
              </PageHeading>
              <i className="margin-top-0 margin-bottom-1 padding-left-3">
                {twoPageMeetingT('conceptPaper.stepThree.italics')}
              </i>
              <ul className="margin-top-0 margin-bottom-5 padding-left-6">
                <li className="line-height-sans-4 margin-bottom-05">
                  <strong>
                    {twoPageMeetingT('conceptPaper.stepThree.alignment.bold')}
                  </strong>
                  {twoPageMeetingT('conceptPaper.stepThree.alignment.text')}
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
                    {twoPageMeetingT('conceptPaper.stepThree.impact.bold')}
                  </strong>
                  {twoPageMeetingT('conceptPaper.stepThree.impact.text')}
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
                    {twoPageMeetingT('conceptPaper.stepThree.feasibility.bold')}
                  </strong>
                  {twoPageMeetingT('conceptPaper.stepThree.feasibility.text')}
                </li>
                <li className="line-height-sans-4 margin-bottom-05">
                  <strong>
                    {twoPageMeetingT('conceptPaper.stepThree.innovation.bold')}
                  </strong>
                  {twoPageMeetingT('conceptPaper.stepThree.innovation.text')}
                </li>
                <li className="line-height-sans-4 margin-bottom-05">
                  <strong>
                    {twoPageMeetingT(
                      'conceptPaper.stepThree.stakeholders.bold'
                    )}
                  </strong>
                  {twoPageMeetingT('conceptPaper.stepThree.stakeholders.text')}
                </li>
              </ul>
            </div>

            <SummaryBox
              heading={twoPageMeetingT(
                'conceptPaper.exampleSummaryBox.heading'
              )}
              className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2 margin-y-0"
            >
              <p className="margin-y-1">
                {twoPageMeetingT('conceptPaper.exampleSummaryBox.text')}
              </p>
              <ul>
                <li>
                  <ExternalLink
                    aria-label="Open in a new tab"
                    href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/AHEAD%20Concept%20Paper.docx?d=w9bd3973322384706a0207c756f773739"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="external"
                  >
                    {twoPageMeetingT('conceptPaper.exampleSummaryBox.list.one')}
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    aria-label="Open in a new tab"
                    href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/Enhancing%20Oncology%20Model%20(formerly%20AOC)%202-pager_October%202021_v2%20clean.docx?d=w4bd1ac8e332c42659f7e4330b519794a"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="external"
                  >
                    {twoPageMeetingT('conceptPaper.exampleSummaryBox.list.two')}
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    aria-label="Open in a new tab"
                    href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/Innovation%20in%20Behavioral%20Health%20(formerly%20BHI)%20Model%202-pager_FINAL.docx?d=wf5dc9e25276945278f98c2c8efc31e16"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="external"
                  >
                    {twoPageMeetingT(
                      'conceptPaper.exampleSummaryBox.list.three'
                    )}
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    aria-label="Open in a new tab"
                    href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/New%20Primary%20Care%20Model%20Concept%202-pager%20Final%20for%20FO.docx?d=webcc03b8baa74b11bc9cd28c264a6178"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="external"
                  >
                    {twoPageMeetingT(
                      'conceptPaper.exampleSummaryBox.list.four'
                    )}
                  </ExternalLink>
                </li>
              </ul>
              <span className="margin-y-0">
                {twoPageMeetingT('conceptPaper.exampleSummaryBox.footer')}
                <ExternalLink
                  aria-label="Open in a new tab"
                  href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/AHEAD%20Concept%20Paper.docx?d=w9bd3973322384706a0207c756f773739"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="external"
                >
                  {twoPageMeetingT('conceptPaper.exampleSummaryBox.footerLink')}
                </ExternalLink>
              </span>
            </SummaryBox>

            <div
              id={covertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.listItem.start')
              )}
              className="margin-bottom-6"
            >
              <PageHeading className="margin-bottom-3" headingLevel="h2">
                {twoPageMeetingT('summaryBox.listItem.start')}
              </PageHeading>
              <p className="margin-top-0 margin-bottom-3 line-height-sans-4">
                {twoPageMeetingT('additionalResources.intro')}
              </p>

              <PageHeading
                className="margin-top-0 margin-bottom-1"
                headingLevel="h3"
              >
                {twoPageMeetingT('additionalResources.subheading')}
              </PageHeading>
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
                twoPageMeetingT('summaryBox.listItem.review')
              )}
              className="margin-bottom-6"
            >
              <PageHeading className="margin-bottom-3" headingLevel="h2">
                {twoPageMeetingT('summaryBox.listItem.review')}
              </PageHeading>
              <p className="margin-top-0 margin-bottom-3 line-height-sans-4">
                {twoPageMeetingT('reviewMeeting.intro')}
                <i>{twoPageMeetingT('reviewMeeting.italicsNowWhat')}</i>
              </p>

              <PageHeading
                className="margin-top-0 margin-bottom-1"
                headingLevel="h3"
              >
                {twoPageMeetingT('reviewMeeting.subheading.tip.text')}
              </PageHeading>
              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                {tipsList.map(k => (
                  <li key={k} className="line-height-sans-4 margin-bottom-05">
                    {k}
                  </li>
                ))}
              </ul>

              <PageHeading
                className="margin-top-0 margin-bottom-1"
                headingLevel="h3"
              >
                {twoPageMeetingT('reviewMeeting.subheading.outcomes.text')}
              </PageHeading>
              {outcomesParagraphs.map(k => (
                <p
                  key={k}
                  className="line-height-sans-4 margin-top-0 margin-bottom-3"
                >
                  {k}
                </p>
              ))}
            </div>

            <SummaryBox heading={twoPageMeetingT('footerSummaryBox.title')}>
              <Trans i18nKey="twoPageMeeting:footerSummaryBox.body">
                indexZero
                <ExternalLink href="mailto:MINTTeam@cms.hhs.gov">
                  email
                </ExternalLink>
                indexTwo
              </Trans>
            </SummaryBox>
          </Grid>
        </GridContainer>
      </MainContent>
      <div className="margin-top-6 margin-bottom-neg-7">
        <RelatedArticles
          currentArticle={twoPageMeetingT('title')}
          viewAllLink
        />
      </div>
    </>
  );
};

export default TwoPagerMeeting;
