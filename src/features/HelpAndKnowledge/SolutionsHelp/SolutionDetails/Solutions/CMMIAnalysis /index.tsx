import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { timelineTranslationUtil } from 'features/HelpAndKnowledge/SolutionsHelp/util';

import { getTransLinkComponents } from '../Generic/About';

import '../index.scss';

const CMMIAnalysisTimeline = ({ solution }: { solution: HelpSolutionType }) => {
  const { t } = useTranslation('helpAndKnowledge');

  const timelineConfig = timelineTranslationUtil(solution.key);

  return (
    <div className="operational-solution-details line-height-body-5 font-body-md">
      {timelineConfig?.header && (
        <h3 className="margin-bottom-0 text-bold">
          {t(timelineConfig.header)}
        </h3>
      )}
      <ProcessList>
        {timelineConfig?.items?.map((item: any, index: number) => (
          <ProcessListItem
            key={item.header}
            className="operational-solution-details__timeline-item"
          >
            <ProcessListHeading type="h3" className="margin-top-neg-05">
              {t(item.header)}
            </ProcessListHeading>
            <Trans
              i18nKey={`solutions.${solution.key}.timeline.items.${index}.description`}
              t={t}
              components={{
                italic: <p className="text-italic text-base margin-top-05" />,
                ...getTransLinkComponents(timelineConfig.items[index].links)
              }}
            />
          </ProcessListItem>
        ))}
      </ProcessList>

      {timelineConfig?.header2 && (
        <h3 className="margin-bottom-0 text-bold">
          {t(timelineConfig.header2)}
        </h3>
      )}

      <ProcessList>
        {timelineConfig?.items2?.map((item: any, index: number) => (
          <ProcessListItem
            key={item.header}
            className="operational-solution-details__timeline-item"
          >
            <ProcessListHeading type="h3" className="margin-top-neg-05">
              {t(item.header)}
            </ProcessListHeading>

            <Trans
              i18nKey={`solutions.${solution.key}.timeline.items2.${index}.description`}
              t={t}
              components={{
                italic: <p className="text-italic text-base" />,
                ...getTransLinkComponents(timelineConfig.items2[index].links)
              }}
            />
          </ProcessListItem>
        ))}
      </ProcessList>

      {/* {timelineConfig?.items2 && (
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
                ),
                ...getTransLinkComponents(timelineConfig.items2[0].links)
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
      )} */}
    </div>
  );
};

export default CMMIAnalysisTimeline;
