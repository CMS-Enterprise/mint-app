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

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import ScrollLink from 'components/ScrollLink';
import useModalSolutionState from 'hooks/useModalSolutionState';
import { formatDateUtc } from 'utils/date';
import { tArray } from 'utils/translation';

import KeyResourcesCards from '../_components/KeyResourcesCards';
import NeedHelp from '../_components/NeedHelp';
import { ArticleCategories, HelpArticle } from '..';

export const convertToLowercaseAndDashes = (string: string) =>
  string.toLowerCase().replace(/\s+/g, '-');

const TwoPagerMeeting = () => {
  const { t: twoPageMeetingT } = useTranslation('twoPageMeeting');

  const location = useLocation();

  const [initLocation] = useState<string>(location.pathname);

  const { prevPathname, selectedSolution, loading } = useModalSolutionState();

  const ldgRoute = `${initLocation}${location.search}${
    location.search ? '&' : '?'
  }solution=learning-and-diffusion-group&section=about`;

  const summaryboxListItems: string[] = tArray(
    'twoPageMeeting:summaryBox.list'
  );

  const aboutTipsList: string[] = tArray(
    'twoPageMeeting:about.summarybox.list'
  );

  const contractorParagraphs: string[] = tArray(
    'twoPageMeeting:templateGuidance.contractorParagraph'
  );

  const additionalResourceTips: string[] = tArray(
    'twoPageMeeting:templateGuidance.summarybox.tips.list'
  );

  const crossCutListItems: string[] = tArray(
    'twoPageMeeting:templateGuidance.crossCut.list'
  );

  const exampleList: { copy: string; href: string }[] = tArray(
    'twoPageMeeting:examplePapers.exampleList'
  );

  if (loading) {
    return <PageLoading />;
  }

  return (
    <>
      {selectedSolution && (
        <SolutionDetailsModal
          solution={selectedSolution}
          openedFrom={prevPathname}
          closeRoute="/help-and-knowledge/about-2-page-concept-papers-and-review-meetings"
        />
      )}

      <MainContent>
        <GridContainer>
          <Grid>
            <div className="margin-bottom-4">
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

              <Alert type="info" slim className="margin-bottom-4">
                <Trans
                  i18nKey="twoPageMeeting:templateInfo.text"
                  components={{
                    el: (
                      <ExternalLink href={twoPageMeetingT('templateInfo.link')}>
                        {' '}
                      </ExternalLink>
                    )
                  }}
                />
              </Alert>

              <SummaryBox className="bg-base-lightest border-0 radius-0 margin-top-0 padding-y-2 padding-x-2">
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
            </div>

            {/* Key resources section */}
            <div
              id={convertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.list.0')
              )}
              className="margin-bottom-2 scroll-target"
            >
              <h2 className="margin-top-0margin-bottom-3">
                {twoPageMeetingT('summaryBox.list.0')}
              </h2>

              <p className="margin-top-0 margin-bottom-3 line-height-normal">
                {twoPageMeetingT('keyResources.introParagraph')}
              </p>

              <KeyResourcesCards articleKey="twoPageMeeting" />
            </div>

            {/* About section */}
            <div
              id={convertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.list.1')
              )}
              className="margin-bottom-3 scroll-target"
            >
              <h2 className="margin-top-0 margin-bottom-3">
                {twoPageMeetingT('summaryBox.list.1')}
              </h2>
              <p className="margin-top-0 margin-bottom-3 line-height-normal">
                {twoPageMeetingT('about.introParagraph')}
              </p>
              <p className="margin-top-0 margin-bottom-3 line-height-normal">
                {' '}
                {twoPageMeetingT('about.note')}
              </p>

              <SummaryBox className="padding-3">
                <SummaryBoxHeading
                  headingLevel="h3"
                  className="margin-bottom-2"
                >
                  {twoPageMeetingT('about.summarybox.heading')}
                </SummaryBoxHeading>

                <SummaryBoxContent>
                  <ul className="margin-top-0 margin-bottom-2 padding-left-6">
                    {aboutTipsList.map(item => (
                      <li key={item} className="line-height-normal">
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="margin-y-0">
                    <Trans
                      t={twoPageMeetingT}
                      i18nKey="about.summarybox.footer"
                      components={{
                        el: (
                          <ExternalLink
                            inlineText
                            className="margin-right-0"
                            href="https://share.cms.gov/center/cmmi/SR/SitePages/Home.aspx"
                          >
                            {' '}
                          </ExternalLink>
                        )
                      }}
                    />
                  </p>
                </SummaryBoxContent>
              </SummaryBox>
            </div>

            {/* Template guidance section */}
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
                            to={ldgRoute}
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

            {/* Example papers section */}
            <div
              id={convertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.list.3')
              )}
              className="margin-bottom-6 scroll-target border border-gray-10 shadow-2px radius-md padding-3"
            >
              <h2 className="margin-top-0 margin-bottom-3">
                {twoPageMeetingT('summaryBox.list.3')}
              </h2>

              <p className="margin-top-0 margin-bottom-1 line-height-normal">
                {twoPageMeetingT('examplePapers.introParagraph')}
              </p>

              <ul className="margin-y-0 padding-left-3">
                {exampleList.map(item => (
                  <li
                    key={item.copy}
                    className="line-height-normal margin-bottom-1"
                  >
                    <ExternalLink
                      href={item.href}
                      className="text-no-underline"
                    >
                      {item.copy}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>

            <NeedHelp />

            <div className="text-base text-italic border-top border-gray-10 padding-top-1 margin-bottom-4">
              {twoPageMeetingT('helpAndKnowledge:lastUpdated', {
                date: formatDateUtc(
                  twoPageMeetingT('lastUpdatedDate'),
                  'MM/dd/yyyy'
                )
              })}
            </div>
          </Grid>
        </GridContainer>
      </MainContent>
      <div className="margin-top-2">
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
