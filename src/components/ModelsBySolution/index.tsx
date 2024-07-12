import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import { formatDateUtc } from 'utils/date';
import TaskListStatus from 'views/ModelPlan/TaskList/_components/TaskListStatus';

import { ModelsBySolutionType } from './table';

import './index.scss';

type ModelSolutionCardProps = {
  className?: string;
  modelPlan: ModelsBySolutionType[0]['modelPlan'];
};

const ModelSolutionCard = ({
  className,
  modelPlan
}: ModelSolutionCardProps) => {
  const { t: customHomeT } = useTranslation('customHome');

  const { id, basics, modelName, status } = modelPlan;

  return (
    <Card
      data-testid={modelName}
      className={classNames('model-solution-card', className)}
    >
      <div>
        <Grid row>
          <Grid desktop={{ col: 12 }}>
            <h3 className="model-solution-card__title margin-top-0">
              <UswdsReactLink to={`/models/${id}/task-list`}>
                {modelName}
              </UswdsReactLink>
            </h3>
          </Grid>

          <Grid desktop={{ col: 12 }}>
            <div className="display-flex">
              <p className="text-bold margin-top-0 margin-right-1">
                {customHomeT('solutionCard.status')}
              </p>
              <TaskListStatus modelID={id} status={status} />
            </div>
          </Grid>

          <Grid desktop={{ col: 12 }}>
            <p className="text-bold margin-y-0 margin-right-1">
              {customHomeT('solutionCard.category')}
            </p>
            {basics.modelCategory ? (
              basics.modelCategory
            ) : (
              <i className="text-base">{customHomeT('solutionCard.tbd')}</i>
            )}
          </Grid>

          <Grid row gap>
            <Grid desktop={{ col: 6 }}>
              <p className="text-bold margin-bottom-0 margin-right-1">
                {customHomeT('solutionCard.startDate')}
              </p>
              <p className="text-bold margin-top-0 margin-bottom-0">
                {basics.applicationsStart ? (
                  formatDateUtc(basics.applicationsStart, 'MMMM d, yyyy')
                ) : (
                  <i className="text-base">{customHomeT('solutionCard.tbd')}</i>
                )}
              </p>
            </Grid>

            <Grid desktop={{ col: 6 }}>
              <p className="text-bold margin-bottom-0 margin-right-1">
                {customHomeT('solutionCard.endDate')}
              </p>
              <p className="text-bold margin-top-0 margin-bottom-0">
                {basics.applicationsEnd ? (
                  formatDateUtc(basics.applicationsEnd, 'MMMM d, yyyy')
                ) : (
                  <i className="text-base">{customHomeT('solutionCard.tbd')}</i>
                )}
              </p>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Card>
  );
};

export default ModelSolutionCard;
