import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Link,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

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
    <div className="line-height-body-5 font-body-md">
      <Trans i18nKey={`solutions.${solution.key}.timeline.description`}>
        Since this is a self service tool, you can work at your own pace. If you
        have questions or need help using CMS Qualtrics, contact the MINT Team
        at{' '}
        <Link
          aria-label="Open in a new tab"
          href="mailto:MINTTeam@cms.hhs.gov"
          target="_blank"
          rel="noopener noreferrer"
        >
          MINTTeam@cms.hhs.gov
        </Link>
        .
      </Trans>

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
            <Link
              aria-label="Open in a new tab"
              href="https://cms.gov1.qualtrics.com/"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {timelineConfig.links && timelineConfig.links[0]}
            </Link>
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
