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

import { getTransLinkComponents } from '../Generic/About';

import '../index.scss';

export interface ProcessListItemProps {
  className?: string;
  children?: React.ReactNode;
}

const SharedSystemsTimeLine = ({
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
          key={timelineConfig.items[0].header}
          className="operational-solution-details__timeline-item"
        >
          <ProcessListHeading
            type="h3"
            className="margin-top-neg-05 margin-bottom-1"
          >
            {timelineConfig.items[0].header}
          </ProcessListHeading>

          <span>
            <Trans
              i18nKey={`solutions.${solution.key}.timeline.items.0.description`}
              t={t}
              // @ts-ignore
              components={{
                ...getTransLinkComponents(timelineConfig.items[0].links)
              }}
            />
          </span>
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

          <span>
            <Trans
              i18nKey={`solutions.${solution.key}.timeline.items.1.description`}
              t={t}
              components={{
                link1: (
                  <ExternalLink
                    href="https://share.cms.gov/center/cmmi-eos/CMMITraining/SitePages/FFSHome.aspx"
                    className="display-block margin-top-105 margin-bottom-3"
                  >
                    {' '}
                  </ExternalLink>
                ),
                ...getTransLinkComponents(timelineConfig.items[1].links)
              }}
            />
          </span>

          {timelineConfig.items[1].items && (
            <ul className="padding-left-4 margin-top-0">
              <li key="cr-item-0" className="list-item">
                <Trans
                  i18nKey={`solutions.${solution.key}.timeline.items.1.items.0`}
                  t={t}
                  components={{
                    bold: <span className="text-bold" />
                  }}
                />
              </li>

              <li key="cr-item-1" className="list-item">
                <Trans
                  i18nKey={`solutions.${solution.key}.timeline.items.1.items.1`}
                  t={t}
                  components={{
                    bold: <span className="text-bold" />
                  }}
                />
              </li>
            </ul>
          )}
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

          <p>{timelineConfig.items[2].description}</p>
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

          <p>{timelineConfig.items[3].description}</p>
        </ProcessListItem>
      </ProcessList>
    </div>
  );
};

export default SharedSystemsTimeLine;
