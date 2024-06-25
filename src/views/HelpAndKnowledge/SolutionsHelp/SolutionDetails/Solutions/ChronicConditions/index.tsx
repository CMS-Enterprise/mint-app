import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import ExternalLink from 'components/shared/ExternalLink';
import { HelpSolutionType } from 'views/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import { TimelineConfigType } from '../Generic/timeline';

import '../index.scss';

const ChronicConditionsTimeline = ({
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

      {timelineConfig?.header && (
        <h2 className="margin-bottom-0">{timelineConfig.header}</h2>
      )}

      <ProcessList>
        <ProcessListItem
          key="obtain-dua"
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
            <ExternalLink href="https://www.cms.gov/research-statistics-data-and-systems/files-for-order/data-disclosures-data-agreements/overview">
              {timelineConfig.links && timelineConfig.links[0]}
            </ExternalLink>
          </p>
        </ProcessListItem>

        <ProcessListItem
          key="complete-ccw"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[1].header}
          </ProcessListHeading>

          <Trans
            t={t}
            i18nKey={`solutions.${solution.key}.timeline.items.1.description`}
            components={{
              email: (
                <ExternalLink href="mailto:CCWAccess@cms.hhs.go">
                  {' '}
                </ExternalLink>
              )
            }}
          />
        </ProcessListItem>

        <ProcessListItem
          key="complete-cars"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading type="h3" className="margin-top-neg-05">
            {timelineConfig.items[2].header}
          </ProcessListHeading>

          <p>{timelineConfig.items[2].description}</p>
        </ProcessListItem>

        <ProcessListItem
          key="complete-training"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading type="h3" className="margin-top-neg-05">
            {timelineConfig.items[3].header}
          </ProcessListHeading>

          <p>{timelineConfig.items[3].description}</p>
        </ProcessListItem>
      </ProcessList>

      {timelineConfig?.header2 && (
        <h2 className="margin-bottom-0">{timelineConfig.header2}</h2>
      )}

      {timelineConfig?.items2 && (
        <ProcessList>
          <ProcessListItem
            key="complete-request"
            className="operational-solution-details__timeline-item"
          >
            <ProcessListHeading
              type="h3"
              className="margin-top-neg-05 margin-bottom-1"
            >
              {timelineConfig.items2[0].header}
            </ProcessListHeading>

            <Trans
              i18nKey={`solutions.${solution.key}.timeline.items.1.description`}
              t={t}
              components={{
                email: (
                  <ExternalLink href="mailto:CCWAccess@cms.hhs.gov">
                    {' '}
                  </ExternalLink>
                )
              }}
            />
          </ProcessListItem>

          <ProcessListItem
            key="complete-application"
            className="operational-solution-details__timeline-item"
          >
            <ProcessListHeading type="h3" className="margin-top-neg-05">
              {timelineConfig.items2[1].header}
            </ProcessListHeading>

            <p>{timelineConfig.items2[1].description}</p>
          </ProcessListItem>

          <ProcessListItem
            key="complete-training"
            className="operational-solution-details__timeline-item"
          >
            <ProcessListHeading type="h3" className="margin-top-neg-05">
              {timelineConfig.items2[2].header}
            </ProcessListHeading>

            <p>{timelineConfig.items2[2].description}</p>
          </ProcessListItem>
        </ProcessList>
      )}
    </div>
  );
};

export default ChronicConditionsTimeline;
