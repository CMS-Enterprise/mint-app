import React from 'react';
import { Trans } from 'react-i18next';
import {
  Link,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import { AccordionItemProps } from '@trussworks/react-uswds/lib/components/Accordion/Accordion';

import { Alert } from 'components/Alert';
import ExternalLink from 'components/ExternalLink';
import { convertToLowercaseAndDashes } from 'utils/modelPlan';

import { AccordionItemsConfigType } from '.';

const AccordionItems = (
  config: Record<string, AccordionItemsConfigType>
): AccordionItemProps[] => {
  const accordionItemKeys = Object.keys(config);

  return accordionItemKeys.map(key => {
    const itemConfig = config[key];

    return {
      title: itemConfig.title,
      content: (
        <div className="padding-y-1 line-height-normal">
          <Trans>{itemConfig.content.intro}</Trans>

          {itemConfig.content.hint && (
            <Alert type="info" slim className="margin-y-1">
              <Trans
                defaults={itemConfig.content.hint.text}
                components={{
                  el: (
                    <ExternalLink href={itemConfig.content.hint.link || ''}>
                      {' '}
                    </ExternalLink>
                  )
                }}
              />
            </Alert>
          )}

          {itemConfig.content.label && (
            <div className="margin-y-1">
              <span>{itemConfig.content.label}</span>

              {itemConfig.content.list && (
                <ul className="padding-left-3 margin-top-0 margin-bottom-1">
                  {itemConfig.content.list.map(
                    (listItem: string, index: number) => (
                      <li key={listItem} className="list-item">
                        {listItem}
                        {itemConfig.content.subList &&
                          itemConfig.content.subList[index] && (
                            <ul className="padding-left-3 margin-top-0 margin-bottom-1">
                              {itemConfig.content.subList[index].map(
                                (subListItem: string) => (
                                  <li key={subListItem} className="list-item">
                                    {subListItem}
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          )}

          {itemConfig.content.text1 && (
            <p className="margin-top-0 margin-bottom-1">
              <Trans>{itemConfig.content.text1}</Trans>
            </p>
          )}

          {itemConfig.content.text2 && (
            <p className="margin-y-0">
              <Trans>{itemConfig.content.text2}</Trans>
            </p>
          )}

          {itemConfig.content.summary && (
            <SummaryBox className="padding-3">
              <SummaryBoxHeading headingLevel="h3" className="margin-bottom-1">
                {itemConfig.content.summary.heading}
              </SummaryBoxHeading>

              <SummaryBoxContent
                className="display-flex flex-column"
                style={{ gap: '1rem' }}
              >
                {itemConfig.content.summary.body.map(text => (
                  <p
                    key={convertToLowercaseAndDashes(text)}
                    className="margin-y-0"
                  >
                    <Trans
                      defaults={text}
                      components={{
                        el1: (
                          <Link
                            href={itemConfig.content.summary?.links?.[0] || ''}
                            target="_blank"
                          >
                            {' '}
                          </Link>
                        ),
                        el2: (
                          <ExternalLink
                            href={itemConfig.content.summary?.links?.[1] || ''}
                          >
                            {' '}
                          </ExternalLink>
                        ),
                        email: (
                          <Link href="mailto:CMMINewModelDesign@cms.hhs.gov">
                            {' '}
                          </Link>
                        )
                      }}
                    />
                  </p>
                ))}
              </SummaryBoxContent>
            </SummaryBox>
          )}
        </div>
      ),
      expanded: true,
      headingLevel: 'h4',
      id: `${convertToLowercaseAndDashes(itemConfig.title)}`
    };
  });
};

export default AccordionItems;
