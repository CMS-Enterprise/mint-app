import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import ExternalLink from 'components/shared/ExternalLink';
import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import { TimelineConfigType } from '../Generic/timeline';

import '../index.scss';

const SalesforceApplicationReviewTimeline = ({
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

      <ProcessList>
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

          {timelineConfig.items[0].items && (
            <ul className="padding-left-4 margin-top-0 margin-bottom-05">
              {timelineConfig.items[0].items.map(item => (
                <li key={item} className="list-item">
                  {item}
                </li>
              ))}
            </ul>
          )}

          <ExternalLink href="https://cmmi.my.salesforce-sites.com/ccb/SF_CCB_OR_CR_Submission_vf">
            {timelineConfig.links && timelineConfig.links[0]}
          </ExternalLink>
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
        </ProcessListItem>

        <ProcessListItem
          key={timelineConfig.items[4].header}
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[4].header}
          </ProcessListHeading>
        </ProcessListItem>

        <ProcessListItem
          key={timelineConfig.items[5].header}
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[5].header}
          </ProcessListHeading>
        </ProcessListItem>
      </ProcessList>
    </div>
  );
};

export default SalesforceApplicationReviewTimeline;
