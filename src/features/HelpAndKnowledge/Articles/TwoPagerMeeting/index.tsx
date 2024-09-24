import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  Card,
  CardGroup,
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
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { getKeys } from 'types/translation';
import { tArray, tObject } from 'utils/translation';

import { ArticleCategories, HelpArticle } from '..';

import ModelSectionCriteriaTable from './table';

export const covertToLowercaseAndDashes = (string: string) =>
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
              type={ArticleCategories.MODEL_CONCEPT_AND_DESIGN}
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
                      scrollTo={twoPageMeetingT(
                        'summaryBox.listItem.keyResources'
                      )}
                    />
                  </li>
                  <li className="margin-bottom-1">
                    <Link
                      scrollTo={twoPageMeetingT('summaryBox.listItem.about')}
                    />
                  </li>
                  <li className="margin-bottom-1">
                    <Link
                      scrollTo={twoPageMeetingT(
                        'summaryBox.listItem.additionalResources'
                      )}
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

              <CardGroup>
                <Card
                  gridLayout={{ desktop: { col: 6 } }}
                  containerProps={{ className: 'shadow-2 padding-2' }}
                >
                  <p className="text-bold margin-y-0 line-height-sans-4">
                    {twoPageMeetingT(
                      'keyResources.cards.strategyRefresh.heading'
                    )}
                  </p>
                  <ExternalLink
                    className="line-height-sans-4"
                    href="https://share.cms.gov/center/cmmi/SR/SitePages/Home.aspx"
                  >
                    {twoPageMeetingT(
                      'keyResources.cards.strategyRefresh.link1'
                    )}
                  </ExternalLink>
                  <ExternalLink
                    className="line-height-sans-4"
                    href="https://share.cms.gov/center/cmmi/SR/ModelDev/Forms/AllItems.aspx"
                  >
                    {twoPageMeetingT(
                      'keyResources.cards.strategyRefresh.link2'
                    )}
                  </ExternalLink>
                </Card>
                <Card
                  gridLayout={{ desktop: { col: 6 } }}
                  containerProps={{ className: 'shadow-2 padding-2' }}
                >
                  <p className="text-bold margin-y-0 line-height-sans-4">
                    {twoPageMeetingT(
                      'keyResources.cards.twoPageTemplate.heading'
                    )}
                  </p>
                  <p className="text-base margin-y-0 line-height-sans-4">
                    {twoPageMeetingT('keyResources.cards.twoPageTemplate.copy')}
                  </p>
                  <ExternalLink
                    className="line-height-sans-4"
                    href="https://share.cms.gov/center/cmmi/SR/ModelDev/Model%20and%20Initiative%20Templates/2024%20Model%20Templates/Model%20Development%202-pager%20Template%205.24%20CLEAN.docx"
                  >
                    {twoPageMeetingT('keyResources.cards.twoPageTemplate.link')}
                  </ExternalLink>
                </Card>
              </CardGroup>
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
                <Trans
                  t={twoPageMeetingT}
                  i18nKey="about.alert"
                  components={{
                    el: (
                      <ExternalLink
                        className="margin-right-0"
                        href="https://share.cms.gov/center/cmmi/SR/ModelDev/Model%20and%20Initiative%20Templates/2024%20Model%20Templates/Model%20Development%202-pager%20Template%205.24%20CLEAN.docx"
                      />
                    )
                  }}
                />
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
                  <ul
                    className="margin-top-0 padding-left-2"
                    style={{ listStyleType: 'disc' }}
                  >
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
                {Object.values(stepThreeList).map(k => (
                  <li
                    key={covertToLowercaseAndDashes(k.text)}
                    className="line-height-sans-4 margin-bottom-05"
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
                            key={covertToLowercaseAndDashes(listItem)}
                            className="line-height-sans-4"
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
                            key={covertToLowercaseAndDashes(listItem)}
                            className="line-height-sans-4"
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
                      <li key={k} className="line-height-sans-4">
                        {k}
                      </li>
                    ))}
                  </ul>
                  <p className="margin-y-0">
                    {twoPageMeetingT('about.summarybox.tips.secondParagraph')}
                  </p>
                  <ul className="margin-top-0 margin-bottom-2 padding-left-6">
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
                    <Trans
                      i18nKey={k}
                      components={{
                        ml: (
                          <UswdsReactLink
                            className="usa-button usa-button--unstyled"
                            to="high-level-project-plan?solution=learning-and-diffusion-group&section=about"
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
                      <li key={k} className="line-height-sans-4">
                        {k}
                      </li>
                    ))}
                  </ul>
                </SummaryBoxContent>
              </SummaryBox>

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('reviewMeeting.criteria.heading')}
              </h3>
              <p className="margin-y-0 line-height-sans-4">
                {twoPageMeetingT('reviewMeeting.criteria.copy')}
              </p>

              {/* Table goes here */}
              <ModelSectionCriteriaTable />

              <h3 className="margin-top-0 margin-bottom-1">
                {twoPageMeetingT('reviewMeeting.outcomes.heading')}
              </h3>
              <p className="margin-y-0 line-height-sans-4">
                {twoPageMeetingT('reviewMeeting.outcomes.copy')}
              </p>
              <ul className="margin-y-0 padding-left-3">
                {outcomesList.map(k => (
                  <li key={k} className="line-height-sans-4">
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
