import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import ExternalLink from 'components/ExternalLink';

import { TimelineConfigType } from '../Generic/timeline';

import '../index.scss';

export interface ProcessListItemProps {
  className?: string;
  children?: React.ReactNode;
}

const OutlookMailboxTimeLine = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig: TimelineConfigType = t(
    `solutions.${solution.key}.timeline`,
    {
      returnObjects: true
    }
  );

  return (
    <div className="operational-solution-details line-height-body-5 font-body-md">
      <p>{timelineConfig.description}</p>

      <ProcessList className="padding-top-1">
        <ProcessListItem
          key="submit-request"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[0].header}
          </ProcessListHeading>

          <Trans
            i18nKey={`solutions.${solution.key}.timeline.items.0.description`}
            t={t}
            components={{
              bold: <span className="text-bold" />
            }}
          />

          {timelineConfig.items[0].items && (
            <ul className="padding-left-4 margin-top-0 margin-bottom-4">
              {timelineConfig.items[0].items.map(item => {
                // Checking if list item contains nested list items
                if (typeof item === 'object') {
                  return (
                    <ul key="sub-item-list">
                      {item.items.map((subItem: string) => (
                        <li key={subItem} className="list-item">
                          {subItem}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <li key={item} className="list-item">
                    {item}
                  </li>
                );
              })}
            </ul>
          )}

          <Trans
            i18nKey={`solutions.${solution.key}.timeline.items.0.description2`}
            t={t}
            components={{
              email: (
                <ExternalLink href="mailto:cms_it_service_desk@cms.hhs.gov">
                  {' '}
                </ExternalLink>
              )
            }}
          />
        </ProcessListItem>

        <ProcessListItem
          key="mailbox-created"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[1].header}
          </ProcessListHeading>

          <p>{timelineConfig.items[1].description}</p>
        </ProcessListItem>
      </ProcessList>
    </div>
  );
};

export default OutlookMailboxTimeLine;
