import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { timelineTranslationUtil } from 'features/HelpAndKnowledge/SolutionsHelp/util';

import ExternalLink from 'components/ExternalLink';

import '../index.scss';

const CentralizedDataExhangeTimeline = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig = timelineTranslationUtil(solution.key);
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
            t={t}
            i18nKey={`solutions.${solution.key}.timeline.items.0.description`}
            components={{
              email: (
                <ExternalLink href="mailto:MINTTeam@cms.hhs.go"> </ExternalLink>
              )
            }}
          />
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
                  t={t}
                  i18nKey={`solutions.${solution.key}.timeline.items.1.items.0`}
                  components={{
                    link1: (
                      <ExternalLink href="https://portalval.cms.gov/portal/">
                        {' '}
                      </ExternalLink>
                    )
                  }}
                />
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
