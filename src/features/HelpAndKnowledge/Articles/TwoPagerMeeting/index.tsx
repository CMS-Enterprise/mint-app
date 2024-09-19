import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  Grid,
  GridContainer,
  Icon,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import ExternalLink from 'components/ExternalLink';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { tArray } from 'utils/translation';

import { ArticleCategories, HelpArticle } from '..';

const covertToLowercaseAndDashes = (string: string) =>
  string.toLowerCase().replace(/\s+/g, '-');

const Link = ({ scrollTo }: { scrollTo: string }) => {
  return (
    <a
      href={`#${covertToLowercaseAndDashes(scrollTo)}`}
      className="display-flex flex-align-center"
    >
      {scrollTo}
      <Icon.ArrowForward />
    </a>
  );
};

const TwoPagerMeeting = () => {
  const { t: twoPageMeetingT } = useTranslation('twoPageMeeting');

  const briefItems = tArray<string>(
    'twoPageMeeting:about.stepOne.items.brief.list'
  );

  const alignmentListItems: string[] = tArray(
    'twoPageMeeting:about.stepThree.alignment.numberedList'
  );

  const impactListItems: string[] = tArray(
    'twoPageMeeting:about.stepThree.impact.list'
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

  const tipsList: string[] = tArray(
    'twoPageMeeting:reviewMeeting.subheading.tip.list'
  );

  const outcomesParagraphs: string[] = tArray(
    'twoPageMeeting:reviewMeeting.subheading.outcomes.paragraph'
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
            <HelpCategoryTag
              type={ArticleCategories.GETTING_STARTED}
              className="margin-bottom-1"
            />
            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-4">
              {twoPageMeetingT('description')}
            </p>

            <SummaryBox className="bg-base-lightest border-0 radius-0 padding-y-2 padding-x-2">
              <SummaryBoxHeading headingLevel="h3">
                {twoPageMeetingT('summaryBox.title')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
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
              </SummaryBoxContent>
            </SummaryBox>

            <div
              id={covertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.listItem.keyResources')
              )}
              className="margin-bottom-6"
            >
              <h2 className="margin-bottom-3">
                {twoPageMeetingT('summaryBox.listItem.keyResources')}
              </h2>
              <p className="margin-top-0 margin-bottom-3 line-height-sans-4">
                {twoPageMeetingT('keyResources.introParagraph')}
              </p>

              {/* Shared component goes here */}
            </div>

            <div
              id={covertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.listItem.about')
              )}
              className="margin-bottom-6"
            >
              <h2 className="margin-bottom-3">
                {twoPageMeetingT('summaryBox.listItem.about')}
              </h2>
              <p className="margin-top-0 margin-bottom-3 line-height-sans-4">
                {twoPageMeetingT('about.introParagraph')}
              </p>

              <Alert
                type="info"
                slim
                headingLevel="h4"
                className="margin-bottom-3"
              >
                {/* TODO: fix this */}
                <span>{twoPageMeetingT('about.alert')}</span>
                <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/AHEAD%20Concept%20Paper.docx?d=w9bd3973322384706a0207c756f773739">
                  {twoPageMeetingT('about.link')}
                </ExternalLink>
              </Alert>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('about.stepOne.heading')}
              </h3>
              <p className="padding-left-3 margin-bottom-0 line-height-sans-4">
                {twoPageMeetingT('about.stepOne.copy')}
              </p>
              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                <li className="line-height-sans-4">
                  {twoPageMeetingT('about.stepOne.items.brief.text')}
                  <ul className="margin-top-0 padding-left-2">
                    {briefItems.map(k => (
                      <li key={k} className="line-height-sans-4">
                        {k}
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="line-height-sans-4">
                  {twoPageMeetingT('about.stepOne.items.describe')}
                </li>
                <li className="line-height-sans-4">
                  {twoPageMeetingT('about.stepOne.items.include')}
                </li>
                <li className="line-height-sans-4">
                  {twoPageMeetingT('about.stepOne.items.provide')}
                </li>
              </ul>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('about.stepTwo.heading')}
              </h3>
              <p className="padding-left-3 margin-bottom-0 line-height-sans-4">
                {twoPageMeetingT('about.stepTwo.copy')}
              </p>
              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                <li className="line-height-sans-4">
                  {twoPageMeetingT('about.stepTwo.item')}
                </li>
              </ul>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('about.stepThree.heading')}
              </h3>
              <i className="display-block margin-top-0 margin-bottom-1 padding-left-3">
                {twoPageMeetingT('about.stepThree.italics')}
              </i>
              <p className="padding-left-3 margin-bottom-0 line-height-sans-4">
                <Trans
                  t={twoPageMeetingT}
                  i18nKey="about.stepThree.copy"
                  components={{
                    bold: <strong />
                  }}
                />
              </p>
              <ul className="margin-top-0 margin-bottom-5 padding-left-6">
                <li className="line-height-sans-4 margin-bottom-05">
                  <Trans
                    t={twoPageMeetingT}
                    i18nKey="about.stepThree.alignment.text"
                    components={{
                      bold: <strong />
                    }}
                  />
                  <ol className="padding-left-3 margin-top-05">
                    {alignmentListItems.map(k => (
                      <li key={k} className="line-height-sans-4">
                        {k}
                      </li>
                    ))}
                  </ol>
                </li>
                <li className="line-height-sans-4 margin-bottom-05">
                  <Trans
                    t={twoPageMeetingT}
                    i18nKey="about.stepThree.impact.text"
                    components={{
                      bold: <strong />
                    }}
                  />
                  <ul className="padding-left-3 margin-top-05">
                    {impactListItems.map(k => (
                      <li key={k} className="line-height-sans-4">
                        {k}
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="line-height-sans-4 margin-bottom-05">
                  <Trans
                    t={twoPageMeetingT}
                    i18nKey="about.stepThree.feasibility.text"
                    components={{
                      bold: <strong />
                    }}
                  />
                </li>
                <li className="line-height-sans-4 margin-bottom-05">
                  <Trans
                    t={twoPageMeetingT}
                    i18nKey="about.stepThree.innovation.text"
                    components={{
                      bold: <strong />
                    }}
                  />
                </li>
                <li className="line-height-sans-4 margin-bottom-05">
                  <Trans
                    t={twoPageMeetingT}
                    i18nKey="about.stepThree.interestedParty.text"
                    components={{
                      bold: <strong />
                    }}
                  />
                </li>
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
                      <li key={k} className="line-height-sans-4">
                        {k}
                      </li>
                    ))}
                  </ul>
                  <p className="margin-y-0">
                    {twoPageMeetingT('about.summarybox.tips.secondParagraph')}
                  </p>
                  <ul className="margin-y-0 padding-left-6">
                    {aboutTipsList2.map(k => (
                      <li key={k} className="line-height-sans-4">
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

              <SummaryBox className="padding-3 border-gray-10 bg-white">
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
                    <li className="margin-bottom-1">
                      <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/AHEAD%20Concept%20Paper.docx?d=w9bd3973322384706a0207c756f773739">
                        {twoPageMeetingT(
                          'about.summarybox.exampleSummaryBox.list.one'
                        )}
                      </ExternalLink>
                    </li>
                    <li className="margin-bottom-1">
                      <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/Enhancing%20Oncology%20Model%20(formerly%20AOC)%202-pager_October%202021_v2%20clean.docx?d=w4bd1ac8e332c42659f7e4330b519794a">
                        {twoPageMeetingT(
                          'about.summarybox.exampleSummaryBox.list.two'
                        )}
                      </ExternalLink>
                    </li>
                    <li className="margin-bottom-1">
                      <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/Innovation%20in%20Behavioral%20Health%20(formerly%20BHI)%20Model%202-pager_FINAL.docx?d=wf5dc9e25276945278f98c2c8efc31e16">
                        {twoPageMeetingT(
                          'about.summarybox.exampleSummaryBox.list.three'
                        )}
                      </ExternalLink>
                    </li>
                    <li className="margin-bottom-1">
                      <ExternalLink href="https://share.cms.gov/center/cmmi/SR/ModelDev/Submitted%20Two%20Pagers/New%20Primary%20Care%20Model%20Concept%202-pager%20Final%20for%20FO.docx?d=webcc03b8baa74b11bc9cd28c264a6178">
                        {twoPageMeetingT(
                          'about.summarybox.exampleSummaryBox.list.four'
                        )}
                      </ExternalLink>
                    </li>
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
              id={covertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.listItem.additionalResources')
              )}
              className="margin-bottom-6"
            >
              <h2 className="margin-bottom-3">
                {twoPageMeetingT('summaryBox.listItem.additionalResources')}
              </h2>
              <p className="margin-top-0 margin-bottom-3 line-height-sans-4">
                {twoPageMeetingT('additionalResources.intro')}
              </p>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('additionalResources.contractor')}
              </h3>
              {contractorParagraphs.map(k => (
                <p
                  key={k}
                  className="line-height-sans-4 margin-top-0 margin-bottom-3"
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
                      <li key={k} className="line-height-sans-4">
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
              <p className="line-height-sans-4 margin-y-0">
                {twoPageMeetingT('additionalResources.crossCut.copy')}
              </p>

              <ul className="margin-y-0 padding-left-6">
                {crossCutListItems.map(k => (
                  <li key={k} className="line-height-sans-4">
                    {k}
                  </li>
                ))}
              </ul>
            </div>

            <div
              id={covertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.listItem.review')
              )}
              className="margin-bottom-6"
            >
              <h2 className="margin-bottom-3">
                {twoPageMeetingT('summaryBox.listItem.review')}
              </h2>
              <p className="margin-top-0 margin-bottom-3 line-height-sans-4">
                {twoPageMeetingT('reviewMeeting.intro')}
              </p>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('reviewMeeting.subheading.tip.text')}
              </h3>
              <ul className="margin-top-0 margin-bottom-3 padding-left-6">
                {tipsList.map(k => (
                  <li key={k} className="line-height-sans-4 margin-bottom-05">
                    {k}
                  </li>
                ))}
              </ul>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('reviewMeeting.subheading.outcomes.text')}
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
                {twoPageMeetingT('footerSummaryBox.title')}
              </SummaryBoxHeading>
              <SummaryBoxContent>
                <Trans i18nKey="twoPageMeeting:footerSummaryBox.body">
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
