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

const CentralizedDataExhangeTimeline = ({
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
          key="inquire-cdx"
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
            If you’re interested in using CDX for your model or would like to
            learn more about the system, please contact{' '}
            <Link
              aria-label="Open in a new tab"
              href="mailto:MINTTeam@cms.hhs.gov"
              target="_blank"
              rel="noopener noreferrer"
            >
              MINTTeam@cms.hhs.gov
            </Link>{' '}
            to learn more.
          </Trans>
        </ProcessListItem>

        <ProcessListItem
          key="submit-request"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading type="h3" className="margin-top-neg-05">
            {timelineConfig.items[1].header}
          </ProcessListHeading>

          <p>{timelineConfig.items[1].description}</p>

          {timelineConfig.items[1].items && (
            <ol>
              <li>
                <Trans
                  i18nKey={`solutions.${solution.key}.timeline.items[1].items[0]`}
                >
                  Register as New User in the{' '}
                  <Link
                    aria-label="Open in a new tab"
                    href="https://portalval.cms.gov/portal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="external"
                  >
                    {timelineConfig.links && timelineConfig.links[0]}
                  </Link>
                </Trans>
              </li>
              <li>{timelineConfig.items[1].items[1]}</li>
              <li>{timelineConfig.items[1].items[2]}</li>
            </ol>
          )}
        </ProcessListItem>

        <ProcessListItem
          key="write-request"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading type="h3" className="margin-top-neg-05">
            {timelineConfig.items[2].header}
          </ProcessListHeading>

          <p>{timelineConfig.items[2].description}</p>
        </ProcessListItem>
      </ProcessList>
    </div>
  );
};

export default CentralizedDataExhangeTimeline;
