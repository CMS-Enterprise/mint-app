import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

export type TimelineItemType = {
  header: string;
  description: string;
};

export type TimelineConfigType = {
  description: string;
  items: TimelineItemType[];
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
    <div className=" line-height-body-5 font-body-md">
      <p>{t('description')}</p>

      <ProcessList>
        {timelineConfig.items.map(item => (
          <ProcessListItem
            key={item.header}
            className="operational-solution-details__timeline-item"
          >
            <ProcessListHeading type="h3" className="margin-top-neg-05">
              {item.header}
            </ProcessListHeading>
            <p>{item.description}</p>
          </ProcessListItem>
        ))}
      </ProcessList>
    </div>
  );
};

export default GenericTimeline;
