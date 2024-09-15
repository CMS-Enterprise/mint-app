import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import { TimelineConfigType } from '../Generic/timeline';

import '../index.scss';

export interface ProcessListItemProps {
  className?: string;
  children?: React.ReactNode;
}

// https://mint.cms.gov/help-and-knowledge/operational-solutions?solution=4-innovation&section=timeline

const BCDATimeLine = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig: TimelineConfigType = t(
    `solutions.${solution.key}.timeline`,
    {
      returnObjects: true
    }
  );

  return (
    <div className="operational-solution-details line-height-body-5 font-body-md text-pre-wrap">
      {timelineConfig.description && <p>{timelineConfig.description}</p>}

      <ProcessList className="padding-top-1">
        {timelineConfig.items?.map(item => (
          <ProcessListItem
            key={item.header}
            className="operational-solution-details__timeline-item"
          >
            <ProcessListHeading type="h3" className="margin-top-neg-05">
              {item.header}
            </ProcessListHeading>

            <p className="margin-bottom-0">{item.description}</p>

            <ul className="padding-left-4 margin-top-0">
              {item?.items?.map(subItem => (
                <li key={subItem} className="list-item">
                  {subItem}
                </li>
              ))}
            </ul>

            {item.description2 && (
              <p>
                <Trans i18nKey="helpAndKnowledge:solutions.bcda.timeline.items.0.description2">
                  <UswdsReactLink to="/help-and-knowledge/operational-solutions?solution=4-innovation&section=timeline">
                    indexZero
                  </UswdsReactLink>
                </Trans>
              </p>
            )}
          </ProcessListItem>
        ))}
      </ProcessList>
    </div>
  );
};

export default BCDATimeLine;
