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

import GatheringInfoAlert from '../../../_components/GatheringInfoAlert';
import { getTransLinkComponents, LinkType } from '../About';

import '../../index.scss';

export type TimelineItemType = {
  header: string;
  description?: string;
  description2?: string;
  ordered?: boolean;
  items?: any[];
  links?: LinkType[];
};

export type TimelineConfigType = {
  description?: string;
  header?: string;
  items: TimelineItemType[];
  header2?: string;
  items2?: TimelineItemType[];
  links?: string[];
  gatheringInfo?: boolean;
  footer?: string;
};

export const GenericTimeline = ({
  solution
}: {
  solution: HelpSolutionType;
}) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig = timelineTranslationUtil(solution.key);

  return (
    <div className="operational-solution-details line-height-body-5 font-body-md text-pre-wrap">
      <div className="margin-bottom-4">
        {timelineConfig.gatheringInfo && (
          <GatheringInfoAlert solution={solution} className="margin-bottom-4" />
        )}
        {/* {timelineConfig.description && <p>{timelineConfig.description}</p>} */}
        {timelineConfig.description && (
          <Trans
            i18nKey={`solutions.${solution.key}.timeline.description`}
            t={t}
            components={{
              email: (
                <ExternalLink href="mailto:MINTTeam@cms.hhs.gov">
                  {' '}
                </ExternalLink>
              )
            }}
          />
        )}
      </div>

      {timelineConfig.header && (
        <h3 className="margin-bottom-0 text-bold">{timelineConfig.header}</h3>
      )}

      <ProcessList className="padding-top-1">
        {timelineConfig.items?.map((item: any, index: number) => (
          <ProcessListItem
            key={item.header}
            className="operational-solution-details__timeline-item"
          >
            <ProcessListHeading
              type="h3"
              className="margin-top-neg-05 margin-bottom-1"
            >
              {item.header}
            </ProcessListHeading>

            {item.description && (
              <Trans
                i18nKey={`helpAndKnowledge:solutions.${solution.key}.timeline.items.${index}.description`}
                components={{
                  ...getTransLinkComponents(item.links),
                  bold: <strong />,
                  italic: <p className="text-italic text-base" />
                }}
              />
            )}

            {item.items && (
              <ul className="padding-left-4 margin-top-0">
                {item.items.map((subItem: string) => (
                  <li key={subItem} className="list-item">
                    {subItem}
                  </li>
                ))}
              </ul>
            )}

            {item.description2 && (
              <p className="margin-bottom-0">{item.description2}</p>
            )}
          </ProcessListItem>
        ))}
      </ProcessList>

      {timelineConfig.header2 && (
        <h3 className="margin-bottom-0 text-bold">{timelineConfig.header2}</h3>
      )}

      {timelineConfig.items2 && (
        <ProcessList>
          {timelineConfig.items2.map((item: any, index: number) => (
            <ProcessListItem
              key={item.header}
              className="operational-solution-details__timeline-item"
            >
              <ProcessListHeading type="h3" className="margin-top-neg-05">
                {item.header}
              </ProcessListHeading>

              {item.description && (
                <Trans
                  i18nKey={`helpAndKnowledge:solutions.${solution.key}.timeline.items2.${index}.description`}
                  components={{
                    ...getTransLinkComponents(item.links),
                    bold: <strong />,
                    italic: <p className="text-italic text-base" />
                  }}
                />
              )}
            </ProcessListItem>
          ))}
        </ProcessList>
      )}

      {timelineConfig.footer && (
        <p className="margin-y-0">{timelineConfig.footer}</p>
      )}
    </div>
  );
};

export default GenericTimeline;
