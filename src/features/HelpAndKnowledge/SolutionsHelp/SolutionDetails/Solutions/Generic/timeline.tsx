import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import { getTransLinkComponents, LinkType } from './about';

import '../index.scss';

export type TimelineItemType = {
  header: string;
  description?: string;
  description2?: string;
  ordered?: boolean;
  items?: any[];
  links?: LinkType[];
};

export type TimelineConfigType = {
  description?: string;
  header?: string;
  items: TimelineItemType[];
  header2?: string;
  items2?: TimelineItemType[];
  links?: string[];
};

export const GenericTimeline = ({
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
    <div className="operational-solution-details line-height-body-5 font-body-md text-pre-wrap">
      {timelineConfig.description && <p>{timelineConfig.description}</p>}

      <ProcessList className="padding-top-1">
        {timelineConfig.items?.map((item, index) => (
          <ProcessListItem
            key={item.header}
            className="operational-solution-details__timeline-item"
          >
            <ProcessListHeading
              type="h3"
              className="margin-top-neg-05 margin-bottom-1"
            >
              {item.header}
            </ProcessListHeading>

            {item.description && (
              <Trans
                i18nKey={`helpAndKnowledge:solutions.${solution.key}.timeline.items.${index}.description`}
                components={{
                  ...getTransLinkComponents(item.links),
                  bold: <strong />
                }}
              />
            )}

            {item.items && (
              <ul className="padding-left-4 margin-top-0">
                {item.items.map(subItem => (
                  <li key={subItem} className="list-item">
                    {subItem}
                  </li>
                ))}
              </ul>
            )}

            {item.description2 && (
              <p className="margin-bottom-0">{item.description2}</p>
            )}
          </ProcessListItem>
        ))}
      </ProcessList>
    </div>
  );
};

export default GenericTimeline;
