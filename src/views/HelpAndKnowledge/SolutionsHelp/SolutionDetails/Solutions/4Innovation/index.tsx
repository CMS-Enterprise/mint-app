// @ts-nocheck
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

const Innovation4TimeLine = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig: TimelineConfigType = t(
    `solutions.${solution.key}.timeline`,
    {
      returnObjects: true
    }
  );

  return (
    <div className=" line-height-body-5 font-body-md">
      <p>{t('description')}</p>

      <ProcessList>
        <ProcessListItem
          key="4i/ACO-OS"
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading type="h3" className="margin-top-neg-05">
            {timelineConfig.items[0].header}
          </ProcessListHeading>

          <Trans
            i18nKey={`solutions.${solution.key}.timeline.items[0].description`}
          >
            Send an email to{' '}
            <Link
              aria-label="Open in a new tab"
              href="mailto:ACO-OIT@cms.hhs.go"
              target="_blank"
              rel="noopener noreferrer"
            >
              ACO-OIT@cms.hhs.go
            </Link>{' '}
            if interested in using 4i and ACO-OS for your model. Please also
            include Ashley Corbin and Nora Fleming on the email.
          </Trans>
        </ProcessListItem>

        {timelineConfig.items.map((item, index) => {
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
        })}
      </ProcessList>
    </div>
  );
};

export default Innovation4TimeLine;
