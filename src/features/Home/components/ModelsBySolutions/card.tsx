import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import ModelStatusTag from 'components/ModelStatusTag';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateUtc } from 'utils/date';

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
  const basicsConfig = usePlanTranslation('basics');

  const { id, basics, timeline, modelName, abbreviation, status } = modelPlan;

  return (
    <Card
      data-testid={modelName}
      className={classNames('model-solution-card', className)}
    >
      <div>
        <Grid row>
          <Grid desktop={{ col: 12 }}>
            <h3 className="model-solution-card__title margin-top-0">
              <UswdsReactLink to={`/models/${id}/read-view`}>
                {modelName}
                {abbreviation ? ` (${abbreviation})` : ''}
              </UswdsReactLink>
            </h3>
          </Grid>

          <Grid desktop={{ col: 12 }}>
            <div className="display-flex margin-bottom-1">
              <p className="text-bold margin-top-0 margin-right-1 margin-bottom-0">
                {customHomeT('solutionCard.status')}
              </p>
              <ModelStatusTag status={status} />
            </div>
          </Grid>

          <Grid desktop={{ col: 12 }}>
            <p className="text-bold margin-y-0 margin-right-1">
              {customHomeT('solutionCard.category')}
            </p>
            {basics.modelCategory ? (
              basicsConfig.modelCategory.options[basics.modelCategory]
            ) : (
              <i className="text-base">{customHomeT('solutionCard.tbd')}</i>
            )}
          </Grid>

          <Grid desktop={{ col: 12 }}>
            <Grid row gap>
              <Grid desktop={{ col: 6 }} mobile={{ col: 6 }}>
                <p className="text-bold margin-bottom-0 margin-right-1">
                  {customHomeT('solutionCard.startDate')}
                </p>
                <p className="margin-top-0 margin-bottom-0">
                  {timeline.performancePeriodStarts ? (
                    formatDateUtc(
                      timeline.performancePeriodStarts,
                      'MM/dd/yyyy'
                    )
                  ) : (
                    <i className="text-base">
                      {customHomeT('solutionCard.tbd')}
                    </i>
                  )}
                </p>
              </Grid>

              <Grid desktop={{ col: 6 }} mobile={{ col: 6 }}>
                <p className="text-bold margin-bottom-0 margin-right-1">
                  {customHomeT('solutionCard.endDate')}
                </p>
                <p className="margin-top-0 margin-bottom-0">
                  {timeline.performancePeriodEnds ? (
                    formatDateUtc(timeline.performancePeriodEnds, 'MM/dd/yyyy')
                  ) : (
                    <i className="text-base">
                      {customHomeT('solutionCard.tbd')}
                    </i>
                  )}
                </p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Card>
  );
};

export default ModelSolutionCard;
