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

const CMSQualtricsTimeline = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig: TimelineConfigType = t(
    `solutions.${solution.key}.timeline`,
    {
      returnObjects: true
    }
  );

  return (
    <div className="operational-solution-details line-height-body-5 font-body-md">
      <Trans
        i18nKey={`solutions.${solution.key}.timeline.description`}
        t={t}
        components={{
          email: (
            <ExternalLink href="mailto:MINTTeam@cms.hhs.gov"> </ExternalLink>
          )
        }}
      />

      <ProcessList>
        <ProcessListItem
          key="access-cms"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[0].header}
          </ProcessListHeading>

          {timelineConfig.items[0].description}

          <p>
            <ExternalLink href="https://surveys.cms.gov/">
              {timelineConfig.links && timelineConfig.links[0]}
            </ExternalLink>
          </p>
        </ProcessListItem>

        <ProcessListItem
          key="create-survey"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[1].header}
          </ProcessListHeading>

          {timelineConfig.items[1].description}
        </ProcessListItem>

        <ProcessListItem
          key="distribute-survey"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[2].header}
          </ProcessListHeading>

          {timelineConfig.items[2].description}
        </ProcessListItem>
      </ProcessList>
    </div>
  );
};

export default CMSQualtricsTimeline;
