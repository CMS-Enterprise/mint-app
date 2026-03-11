import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Accordion, Grid, GridContainer, Link } from '@trussworks/react-uswds';
import { AccordionItemProps } from '@trussworks/react-uswds/lib/components/Accordion/Accordion';
import HelpBreadcrumb from 'features/HelpAndKnowledge/Articles/_components/HelpBreadcrumb';
import HelpCategoryTag from 'features/HelpAndKnowledge/Articles/_components/HelpCategoryTag';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';

import ExternalLink from 'components/ExternalLink';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { formatDateUtc } from 'utils/date';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';
import { tObject } from 'utils/translation';

import { ArticleCategories, HelpArticle } from '..';

export type AccordionItemsConfigType = {
  title: string;
  content: {
    paragraphs: {
      text: string;
      orderedList?: boolean;
      list?: {
        text: string;
        subList?: string[];
      }[];
    }[];
    paragraphLinks?: {
      [key: string]: {
        href: string;
      };
    };
    resources?: {
      copy: string;
      href: string;
      external: boolean;
    }[];
  };
};

const OperationalPlanning = () => {
  const { t: operationalPlanningT } = useTranslation('operationalPlanning');

  const accordionItemsConfig = tObject<string, AccordionItemsConfigType>(
    'operationalPlanning:accordionItems'
  );

  const accordionTitles = Object.keys(accordionItemsConfig);

  const accordionItems: AccordionItemProps[] = accordionTitles.map(
    (title, index) => ({
      title: accordionItemsConfig[title].title,
      content: (
        <>
          <div className="text-light margin-bottom-3 line-height-normal font-body-md">
            {accordionItemsConfig[title].content.paragraphs.map(paragraph => (
              <div key={convertToLowercaseAndDashes(paragraph.text)}>
                <p className="margin-top-0 margin-bottom-1">
                  <Trans
                    t={operationalPlanningT}
                    i18nKey={paragraph.text}
                    components={{
                      link1: (
                        <ExternalLink
                          href={operationalPlanningT(
                            `accordionItems.${title}.content.paragraphLinks.link1.href`
                          )}
                        >
                          {' '}
                        </ExternalLink>
                      )
                    }}
                  />
                </p>

                {paragraph.list &&
                  (paragraph.orderedList ? (
                    <ol className="padding-left-3 margin-y-0">
                      {paragraph.list.map(listItem => (
                        <li
                          key={convertToLowercaseAndDashes(listItem.text)}
                          className="line-height-normal"
                        >
                          {listItem.text}
                          {listItem.subList && (
                            <ol className="padding-left-3 " type="a">
                              {listItem.subList.map(subListItem => (
                                <li
                                  key={convertToLowercaseAndDashes(subListItem)}
                                  className="line-height-normal"
                                >
                                  {subListItem}
                                </li>
                              ))}
                            </ol>
                          )}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="padding-left-3 margin-top-0 margin-bottom-1">
                      {paragraph.list.map(listItem => (
                        <li
                          key={convertToLowercaseAndDashes(listItem.text)}
                          className="line-height-normal"
                        >
                          {listItem.text}
                        </li>
                      ))}
                    </ul>
                  ))}
              </div>
            ))}
          </div>

          {accordionItemsConfig[title].content.resources?.map(resource => (
            <div key={resource.copy}>
              {resource.external && (
                <ExternalLink href={resource.href}>
                  {resource.copy}
                </ExternalLink>
              )}
            </div>
          ))}
        </>
      ),
      expanded: index === 0,
      headingLevel: 'h3',
      id: `${accordionItemsConfig[title].title.toLowerCase().replace(/\s+/g, '-')}`
    })
  );

  return (
    <MainContent>
      <GridContainer>
        <Grid>
          <HelpBreadcrumb text={operationalPlanningT('title')} />
          <PageHeading className="margin-bottom-1">
            {operationalPlanningT('title')}
          </PageHeading>
          <HelpCategoryTag
            type={ArticleCategories.GETTING_STARTED}
            className="margin-bottom-1"
          />

          <div className="text-light">
            <p className="font-body-lg line-height-sans-5 margin-top-0 margin-bottom-1">
              {operationalPlanningT('description')}
            </p>

            <p className="line-height-normal margin-top-0 margin-bottom-4">
              <Trans
                t={operationalPlanningT}
                i18nKey="mintHelp"
                components={{
                  email: <Link href="mailto:MINTTeam@cms.hhs.gov"> </Link>
                }}
              />
            </p>

            <p className="font-body-md margin-top-0 margin-bottom-3">
              {operationalPlanningT('accordionHelp')}
            </p>
          </div>

          <Accordion
            bordered={false}
            multiselectable
            items={accordionItems}
            className="margin-bottom-4"
          />

          <div className="text-base text-italic border-top border-gray-10 padding-top-1 margin-bottom-4">
            {operationalPlanningT('helpAndKnowledge:lastUpdated', {
              date: formatDateUtc(
                operationalPlanningT('lastUpdatedDate'),
                'MM/dd/yyyy'
              )
            })}
          </div>
        </Grid>
      </GridContainer>
      <div className="margin-top-6 margin-bottom-neg-7">
        <RelatedArticles
          currentArticle={HelpArticle.OPERATIONAL_PLANNING}
          specificArticles={[
            HelpArticle.HIGH_LEVEL_PROJECT_PLAN,
            HelpArticle.PHASES_INVOLVED,
            HelpArticle.MODEL_PLAN_OVERVIEW
          ]}
          viewAllLink
        />
      </div>
    </MainContent>
  );
};

export default OperationalPlanning;
