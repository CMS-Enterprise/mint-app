import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import { TimelineConfigType } from '../Generic/timeline';

import '../index.scss';

export interface ProcessListItemProps {
  className?: string;
  children?: React.ReactNode;
}

const SharedSystemsTimeLine = ({
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
          key={timelineConfig.items[0].header}
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[0].header}
          </ProcessListHeading>

          {timelineConfig.items[0].description}
        </ProcessListItem>

        <ProcessListItem
          key={timelineConfig.items[1].header}
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[1].header}
          </ProcessListHeading>

          <span className="text-pre-wrap">
            {timelineConfig.items[1].description}
          </span>

          {timelineConfig.items[1].items && (
            <ul className="padding-left-4 margin-top-0">
              <li key="cr-item-0" className="list-item">
                <Trans
                  i18nKey={`solutions.${solution.key}.timeline.items[1].items[0]`}
                >
                  <span className="text-bold">Analysis CR</span> - This type of
                  CR is recommended for model teams still figuring out what to
                  do for the model. Essentially, this is a request to talk and
                  collaborate with the Medicare Administrative Contractor (MAC)
                  and Shared System Maintainers (SSM) on what will work for the
                  model. It’s best to do an anaylsis CR a year before changes
                  need made.
                </Trans>
              </li>

              <li key="cr-item-1" className="list-item">
                <Trans
                  i18nKey={`solutions.${solution.key}.timeline.items[1].items[0]`}
                >
                  <span className="text-bold">Implementation CR</span> - This
                  type of CR is for implementing the necessary changes to
                  support the model. It’s best to submit these at least six
                  months prior to needing the changes made.
                </Trans>
              </li>
            </ul>
          )}
        </ProcessListItem>

        <ProcessListItem
          key={timelineConfig.items[2].header}
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[2].header}
          </ProcessListHeading>

          <p>{timelineConfig.items[2].description}</p>
        </ProcessListItem>

        <ProcessListItem
          key={timelineConfig.items[3].header}
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[3].header}
          </ProcessListHeading>

          <p>{timelineConfig.items[3].description}</p>
        </ProcessListItem>
      </ProcessList>
    </div>
  );
};

export default SharedSystemsTimeLine;
