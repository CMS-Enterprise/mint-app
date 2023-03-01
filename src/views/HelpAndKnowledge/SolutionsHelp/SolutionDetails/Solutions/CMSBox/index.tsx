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

const CMSBoxTimeline = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig: TimelineConfigType = t(
    `solutions.${solution.key}.timeline`,
    {
      returnObjects: true
    }
  );

  return (
    <div className="operational-solution-details line-height-body-5 font-body-md">
      <Trans i18nKey={`solutions.${solution.key}.timeline.description`}>
        Since this is a self service tool, you can work at your own pace. If you
        have questions or need help using CMS Box, contact the MINT Team at{' '}
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
              href="https://cmsbox.account.box.com/login"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {timelineConfig.links && timelineConfig.links[0]}
            </Link>
          </p>
        </ProcessListItem>

        <ProcessListItem
          key="configure-cms"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[1].header}
          </ProcessListHeading>

          {timelineConfig.items[1].description}

          <p>
            <Link
              aria-label="Open in a new tab"
              href="https://cmsintranet.share.cms.gov/CT/Pages/BoxInformation.aspx"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {timelineConfig.links && timelineConfig.links[1]}
            </Link>
          </p>
        </ProcessListItem>
      </ProcessList>
    </div>
  );
};

export default CMSBoxTimeline;
