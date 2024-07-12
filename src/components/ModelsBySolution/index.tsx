import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Grid } from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
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
  const { t } = useTranslation('plan');
  const { t: h } = useTranslation('customHome');

  const { id, basics, modelName, status } = modelPlan;

  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  return (
    <Card
      data-testid={modelName}
      className={classNames('grid-col-4 model-solution-card', className)}
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
            <TaskListStatus modelID={id} status={status} />
          </Grid>
        </Grid>

        {/* <Grid row>
          <Grid tablet={{ col: 4 }} mobile={{ col: 12 }}>
            <p className="margin-bottom-0">{t(`${type}:favorite.modelLead`)}</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {collaborators
                .filter(collaborator =>
                  collaborator.teamRoles.includes(TeamRole.MODEL_LEAD)
                )
                .map(collaborator => collaborator.userAccount.commonName)
                .join(', ')}
            </p>
            {isMobile && <Divider className="margin-top-2" />}
          </Grid>
          <Grid tablet={{ col: 4 }} mobile={{ col: isMobile ? 6 : 12 }}>
            <p className="margin-bottom-0">{t(`${type}:favorite.startDate`)}</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {basics.performancePeriodStarts ? (
                formatDateUtc(basics.performancePeriodStarts, 'MMMM d, yyyy')
              ) : (
                <i>{t('favorite.toBeDetermined')}</i>
              )}
            </p>
          </Grid>
          <Grid tablet={{ col: 4 }} mobile={{ col: isMobile ? 6 : 12 }}>
            <p className="margin-bottom-0">{t(`${type}:favorite.cRTDLs`)}</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {crtdlIDs.length ? (
                crtdlIDs.join(', ')
              ) : (
                <i>{t('favorite.noneEntered')}</i>
              )}
            </p>
          </Grid>
        </Grid> */}
      </div>
    </Card>
  );
};

export default ModelSolutionCard;
