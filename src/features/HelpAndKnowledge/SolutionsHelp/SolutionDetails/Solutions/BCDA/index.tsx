import React from 'react';
import { Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import { HelpSolutionType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';
import { timelineTranslationUtil } from 'features/HelpAndKnowledge/SolutionsHelp/util';
import { MtoCommonSolutionKey } from 'gql/generated/graphql';

import '../index.scss';

export interface ProcessListItemProps {
  className?: string;
  children?: React.ReactNode;
}

// https://mint.cms.gov/help-and-knowledge/operational-solutions?solution=4-innovation&section=timeline

const BCDATimeLine = ({ solution }: { solution: HelpSolutionType }) => {
  const timelineConfig = timelineTranslationUtil(solution.key);

  const navigate = useNavigate();

  const isMTORoute = history.location.pathname.includes('model-to-operations');

  const params = new URLSearchParams(history.location.search);

  if (isMTORoute) {
    params.set('solution-key', MtoCommonSolutionKey.INNOVATION);
  }

  return (
    <div className="operational-solution-details line-height-body-5 font-body-md text-pre-wrap">
      {timelineConfig.description && <p>{timelineConfig.description}</p>}

      <ProcessList className="padding-top-1">
        {timelineConfig.items?.map((item: any) => (
          <ProcessListItem
            key={item.header}
            className="operational-solution-details__timeline-item"
          >
            <ProcessListHeading type="h3" className="margin-top-neg-05">
              {item.header}
            </ProcessListHeading>

            <p className="margin-bottom-0">{item.description}</p>

            <ul className="padding-left-4 margin-top-0">
              {item?.items?.map((subItem: string) => (
                <li key={subItem} className="list-item">
                  {subItem}
                </li>
              ))}
            </ul>

            {item.description2 && (
              <p>
                <Trans i18nKey="helpAndKnowledge:solutions.bcda.timeline.items.0.description2">
                  <Button
                    type="button"
                    unstyled
                    onClick={() => {
                      if (isMTORoute) {
                        navigate({ search: params.toString() });
                        const modalCon = document?.getElementsByClassName(
                          'ReactModal__Overlay'
                        )?.[0];
                        modalCon.scrollTo(0, 0);
                      } else {
                        navigate(
                          '/help-and-knowledge/operational-solutions?solution=4-innovation&section=timeline'
                        );
                      }
                    }}
                  >
                    {' '}
                  </Button>
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
