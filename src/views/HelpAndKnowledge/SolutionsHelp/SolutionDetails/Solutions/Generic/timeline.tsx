import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import '../index.scss';

export type TimelineItemType = {
  header: string;
  description?: string;
  ordered?: boolean;
  items?: string[];
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

      <ProcessList>
        {timelineConfig.items?.map(item => (
          <ProcessListItem
            key={item.header}
            className="operational-solution-details__timeline-item"
          >
            <ProcessListHeading type="h3" className="margin-top-neg-05">
              {item.header}
            </ProcessListHeading>

            {item.description && (
              <p className="margin-bottom-0">{item.description}</p>
            )}

            {item.items && (
              <ul className="padding-left-4 margin-top-0">
                {item.items.map(subItem => (
                  <li className="list-item">{subItem}</li>
                ))}
              </ul>
            )}
          </ProcessListItem>
        ))}
      </ProcessList>
    </div>
  );
};

export default GenericTimeline;
