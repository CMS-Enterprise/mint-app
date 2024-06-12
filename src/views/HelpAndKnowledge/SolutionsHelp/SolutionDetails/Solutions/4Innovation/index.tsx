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

export interface ProcessListItemProps {
  className?: string;
  children?: React.ReactNode;
}

const Innovation4TimeLine = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig: TimelineConfigType = t(
    `solutions.${solution.key}.timeline`,
    {
      returnObjects: true
    }
  );

  const StandardTimelineItems = timelineConfig.items.map((item, index) => {
    if (index === 0) return <div key="empty" />;
    return (
      <ProcessListItem
        key={item.header}
        className="operational-solution-details__timeline-item"
      >
        <ProcessListHeading type="h3" className="margin-top-neg-05">
          {item.header}
        </ProcessListHeading>
        <p>{item.description}</p>
      </ProcessListItem>
    );
  });

  return (
    <div className="operational-solution-details line-height-body-5 font-body-md">
      <p>{timelineConfig.description}</p>

      <ProcessList className="padding-top-1">
        <ProcessListItem
          key="4i/ACO-OS"
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
            Send an email to{' '}
            <ExternalLink href="mailto:ACO-OIT@cms.hhs.gov">
              ACO-OIT@cms.hhs.gov
            </ExternalLink>{' '}
            if interested in using 4i and ACO-OS for your model. Please also
            include Ashley Corbin on the email.
          </Trans>
        </ProcessListItem>
        {/* Typescript not satified with mapping through ProcessListItems */}
        {StandardTimelineItems as any}
      </ProcessList>
    </div>
  );
};

export default Innovation4TimeLine;
