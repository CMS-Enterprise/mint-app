import React from 'react';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { timelineTranslationUtil } from 'features/HelpAndKnowledge/SolutionsHelp/util';

import ExternalLink from 'components/ExternalLink';

import '../index.scss';

const SalesforceApplicationReviewTimeline = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const timelineConfig = timelineTranslationUtil(solution.key);

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
              {timelineConfig.items[0].items.map((item: string) => (
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
