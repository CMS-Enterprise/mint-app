import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import ExternalLink from 'components/shared/ExternalLink';
import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

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
            i18nKey={`solutions.${solution.key}.timeline.items[0].description`}
          >
            From the CMS Connect app on your desktop, search for “
            <span className="text-bold">
              Create or manage a resource mailbox
            </span>
            ” or “<span className="text-bold">Mailbox request.</span>” You’ll
            need to provide the following information:
          </Trans>

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

          <Trans i18nKey={`solutions.${solution.key}.timeline.description`}>
            If you’d rather submit a request by email, please send the above
            information to{' '}
            <ExternalLink href="mailto:cms_it_service_desk@cms.hhs.gov.">
              cms_it_service_desk@cms.hhs.gov.
            </ExternalLink>
            .
          </Trans>
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
