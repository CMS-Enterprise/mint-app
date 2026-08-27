import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Accordion,
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

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import ScrollLink from 'components/ScrollLink';
import { formatDateUtc } from 'utils/date';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';
import { tArray, tObject } from 'utils/translation';

import KeyResourcesCards from '../_components/KeyResourcesCards';
// import ModelSectionCriteriaTable from '../_components/ModelSelectionCriteriaTable';
import NeedHelp from '../_components/NeedHelp';
import { ArticleCategories, HelpArticle } from '..';

import AccordionItems from './AccordionItems';

export type AccordionItemsConfigType = {
  title: string;
  content: {
    intro: string;
    hint?: { text: string; link?: string };
    label?: string;
    list?: string[];
    subList?: { [key: number]: string[] };
    text1?: string;
    text2?: string;
    summary?: {
      heading: string;
      body: string[];
      links?: string[];
    };
  };
};

const SixPagerMeeting = () => {
  const { t: sixPageMeetingT } = useTranslation('sixPageMeeting');

  const sections = tArray<string>('sixPageMeeting:sectionsSummaryBox.list');

  const aboutTipsList = tArray<string>(
    'sixPageMeeting:aboutConceptPapers.summarybox.list'
  );

  const accordionItemsConfig = tObject<string, AccordionItemsConfigType>(
    'sixPageMeeting:templateGuidance.accordionItems'
  );

  const mappedAccordionItems = AccordionItems(accordionItemsConfig);

  const exampleList: { copy: string; href: string }[] = tArray(
    'sixPageMeeting:examplePapers.exampleList'
  );

  return (
    <>
      <MainContent className="mint-body-normal">
        <GridContainer>
          <Grid>
            <div className="margin-bottom-4">
              <HelpBreadcrumb text={sixPageMeetingT('title')} />

              <PageHeading className="margin-bottom-2">
                {sixPageMeetingT('title')}
              </PageHeading>

              <HelpCategoryTag
                type={ArticleCategories.MODEL_CONCEPT_AND_DESIGN}
                className="margin-bottom-1"
              />

              <p className="margin-top-0 margin-bottom-4 mint-body-large">
                {sixPageMeetingT('description')}
              </p>

              <Alert type="info" slim className="margin-bottom-4">
                <Trans
                  i18nKey="sixPageMeeting:contentInfo.text"
                  components={{
                    el: (
                      <ExternalLink href={sixPageMeetingT('contentInfo.link')}>
                        {' '}
                      </ExternalLink>
                    )
                  }}
                />
              </Alert>

              <SummaryBox className="bg-base-lightest border-0 radius-0 margin-top-0 padding-2">
                <SummaryBoxHeading
                  headingLevel="h3"
                  className="margin-bottom-1"
                >
                  {sixPageMeetingT('sectionsSummaryBox.heading')}
                </SummaryBoxHeading>
                <SummaryBoxContent>
                  <ul
                    className="margin-y-0 display-flex flex-column padding-left-4"
                    style={{ gap: '0.5rem' }}
                  >
                    {sections.map(section => (
                      <li
                        key={convertToLowercaseAndDashes(section)}
                        className="padding-left-05"
                      >
                        <ScrollLink scrollTo={section} />
                      </li>
                    ))}
                  </ul>
                </SummaryBoxContent>
              </SummaryBox>
            </div>

            {/* Key resources section */}
            <div
              id={convertToLowercaseAndDashes(
                sixPageMeetingT('sectionsSummaryBox.list.0')
              )}
              className="margin-bottom-2 scroll-target"
            >
              <h2 className="margin-top-0 margin-bottom-3">
                {sixPageMeetingT('sectionsSummaryBox.list.0')}
              </h2>

              <p className="margin-top-0 margin-bottom-3">
                {sixPageMeetingT('keyResources.description')}
              </p>

              <KeyResourcesCards articleKey="sixPageMeeting" />
            </div>

            {/* Model Plans in MINT section */}
            <div
              id={convertToLowercaseAndDashes(
                sixPageMeetingT('sectionsSummaryBox.list.1')
              )}
              className="margin-bottom-6 scroll-target"
            >
              <h2 className="margin-top-0 margin-bottom-3">
                {sixPageMeetingT('sectionsSummaryBox.list.1')}
              </h2>

              <p className="margin-top-0 margin-bottom-3">
                {sixPageMeetingT('modelPlansInMINT.description')}
              </p>

              <SummaryBox className="padding-3 margin-y-0">
                <SummaryBoxHeading
                  headingLevel="h3"
                  className="margin-bottom-1"
                >
                  {sixPageMeetingT('modelPlansInMINT.summaryBox.heading')}
                </SummaryBoxHeading>

                <SummaryBoxContent>
                  <UswdsReactLink
                    to={sixPageMeetingT(
                      'modelPlansInMINT.summaryBox.linkOne.link'
                    )}
                    className="display-flex flex-align-center"
                  >
                    {sixPageMeetingT(
                      'modelPlansInMINT.summaryBox.linkOne.text'
                    )}

                    <Icon.ArrowForward
                      className="margin-left-1"
                      aria-label="forward"
                    />
                  </UswdsReactLink>
                </SummaryBoxContent>
              </SummaryBox>
            </div>

            {/* About section */}
            <div
              id={convertToLowercaseAndDashes(
                sixPageMeetingT('sectionsSummaryBox.list.2')
              )}
              className="margin-bottom-3 scroll-target"
            >
              <h2 className="margin-top-0 margin-bottom-3">
                {sixPageMeetingT('sectionsSummaryBox.list.2')}
              </h2>

              <p className="margin-top-0 margin-bottom-3">
                {sixPageMeetingT('aboutConceptPapers.description')}
              </p>

              <SummaryBox className="padding-3">
                <SummaryBoxHeading
                  headingLevel="h3"
                  className="margin-bottom-2"
                >
                  {sixPageMeetingT('aboutConceptPapers.summarybox.heading')}
                </SummaryBoxHeading>

                <SummaryBoxContent>
                  <ul className="margin-top-0 margin-bottom-2 padding-left-3">
                    {aboutTipsList.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <p className="margin-y-0">
                    <Trans
                      t={sixPageMeetingT}
                      i18nKey="aboutConceptPapers.summarybox.footer"
                      components={{
                        el: (
                          <ExternalLink
                            inlineText
                            className="margin-right-0"
                            href={sixPageMeetingT(
                              'aboutConceptPapers.summarybox.footerLink'
                            )}
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
                sixPageMeetingT('sectionsSummaryBox.list.3')
              )}
              className="margin-bottom-3 scroll-target"
            >
              <h2 className="margin-top-0 margin-bottom-3">
                {sixPageMeetingT('sectionsSummaryBox.list.3')}
              </h2>

              <Accordion
                bordered={false}
                multiselectable
                items={mappedAccordionItems}
              />
            </div>

            {/* Example papers section */}
            <div
              id={convertToLowercaseAndDashes(
                sixPageMeetingT('sectionsSummaryBox.list.4')
              )}
              className="margin-bottom-6 scroll-target border border-gray-10 shadow-2 radius-md padding-3"
            >
              <h2 className="margin-top-0 margin-bottom-3">
                {sixPageMeetingT('sectionsSummaryBox.list.4')}
              </h2>

              <p className="margin-top-0 margin-bottom-1 line-height-normal">
                {sixPageMeetingT('examplePapers.description')}
              </p>

              <ul className="margin-y-0 padding-left-4">
                {exampleList.map(item => (
                  <li
                    key={item.copy}
                    className="line-height-normal margin-bottom-1 padding-left-05"
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
              {sixPageMeetingT('helpAndKnowledge:lastUpdated', {
                date: formatDateUtc(
                  sixPageMeetingT('lastUpdatedDate'),
                  'MM/dd/yyyy'
                )
              })}
            </div>
          </Grid>
        </GridContainer>
      </MainContent>
      <div className="margin-top-2">
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
