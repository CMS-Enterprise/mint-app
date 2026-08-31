import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Accordion,
  Grid,
  GridContainer,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import { AccordionItemProps } from '@trussworks/react-uswds/lib/components/Accordion/Accordion';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import Alert from 'components/Alert';
import ExternalLink from 'components/ExternalLink';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import ScrollLink from 'components/ScrollLink';
import { formatDateUtc } from 'utils/date';
import { tArray, tObject } from 'utils/translation';

import KeyResourcesCards from '../_components/KeyResourcesCards';
import NeedHelp from '../_components/NeedHelp';
import { ArticleCategories, HelpArticle } from '..';

type AccordionItemsConfigType = {
  title: string;
  content: {
    intro: string;
    label?: string;
    list?: string[];
    summary?: string;
  };
};

export const convertToLowercaseAndDashes = (string: string) =>
  string.toLowerCase().replace(/\s+/g, '-');

const TwoPagerMeeting = () => {
  const { t: twoPageMeetingT } = useTranslation('twoPageMeeting');

  const summaryboxListItems: string[] = tArray(
    'twoPageMeeting:summaryBox.list'
  );

  const aboutTipsList: string[] = tArray(
    'twoPageMeeting:about.summarybox.list'
  );

  const accordionItemsConfig = tObject<string, AccordionItemsConfigType>(
    'twoPageMeeting:templateGuidance.accordionItems'
  );

  const accordionItemKeys = Object.keys(accordionItemsConfig);

  const accordionItems: AccordionItemProps[] = accordionItemKeys.map(
    (key, index) => {
      const itemConfig = accordionItemsConfig[key];

      return {
        title: itemConfig.title,
        content: (
          <div className="padding-y-1">
            <Trans
              i18nKey={itemConfig.content.intro}
              components={{
                italic: (
                  <p className="text-italic text-base-darkest margin-y-0" />
                )
              }}
            />

            {itemConfig.content.label && (
              <div className="margin-y-1">
                <span>{itemConfig.content.label}</span>

                {itemConfig.content.list && (
                  <ul className="padding-left-3 margin-top-0 margin-bottom-1">
                    {itemConfig.content.list.map((listItem: string) => (
                      <li key={listItem} className="list-item">
                        {listItem}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {itemConfig.content.summary && (
              <Trans i18nKey={itemConfig.content.summary} />
            )}
          </div>
        ),
        expanded: true,
        headingLevel: 'h4',
        id: `${convertToLowercaseAndDashes(itemConfig.title)}`
      };
    }
  );

  const exampleList: { copy: string; href: string }[] = tArray(
    'twoPageMeeting:examplePapers.exampleList'
  );

  return (
    <>
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
                  i18nKey="twoPageMeeting:contentInfo.text"
                  components={{
                    el: (
                      <ExternalLink href={twoPageMeetingT('contentInfo.link')}>
                        {' '}
                      </ExternalLink>
                    )
                  }}
                />
              </Alert>

              <SummaryBox className="bg-base-lightest border-0 radius-0 margin-top-0 padding-y-2 padding-x-2">
                <SummaryBoxHeading
                  headingLevel="h3"
                  className="margin-bottom-1"
                >
                  {twoPageMeetingT('summaryBox.title')}
                </SummaryBoxHeading>
                <SummaryBoxContent>
                  <ul
                    className="margin-y-0 display-flex flex-column padding-left-4"
                    style={{ gap: '0.5rem' }}
                  >
                    {summaryboxListItems.map(section => (
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
                twoPageMeetingT('summaryBox.list.0')
              )}
              className="margin-bottom-2 scroll-target"
            >
              <h2 className="margin-top-0 margin-bottom-3">
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
                  <ul className="margin-top-0 margin-bottom-2 padding-left-3">
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
                            href={twoPageMeetingT(
                              'about.summarybox.footerLink'
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
                twoPageMeetingT('summaryBox.list.2')
              )}
              className="margin-bottom-3 scroll-target"
            >
              <h2 className="margin-top-0 margin-bottom-3">
                {twoPageMeetingT('summaryBox.list.2')}
              </h2>

              <Accordion
                bordered={false}
                multiselectable
                items={accordionItems}
              />
            </div>

            {/* Example papers section */}
            <div
              id={convertToLowercaseAndDashes(
                twoPageMeetingT('summaryBox.list.3')
              )}
              className="margin-bottom-6 scroll-target border border-gray-10 shadow-2 radius-md padding-3"
            >
              <h2 className="margin-top-0 margin-bottom-3">
                {twoPageMeetingT('summaryBox.list.3')}
              </h2>

              <p className="margin-top-0 margin-bottom-1 line-height-normal">
                {twoPageMeetingT('examplePapers.introParagraph')}
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
