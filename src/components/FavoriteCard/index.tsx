import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Grid,
  GridContainer,
  IconStar
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import { GetAllModelPlans_modelPlanCollection as ModelPlanType } from 'queries/ReadOnly/types/GetAllModelPlans';
import { TeamRole } from 'types/graphql-global-types';
import { UpdateFavoriteProps } from 'views/ModelPlan/ModelPlanOverview';
import TaskListStatus from 'views/ModelPlan/TaskList/_components/TaskListStatus';

import './index.scss';

type FavoriteCardProps = {
  className?: string;
  type?: 'modelPlan'; // Built in for future iterations/varations of favorited datasets that ingest i18n translations for headers.
  modelPlan: ModelPlanType;
  removeFavorite: (modelPlanID: string, type: UpdateFavoriteProps) => void;
};

const FavoriteCard = ({
  className,
  type = 'modelPlan',
  modelPlan,
  removeFavorite
}: FavoriteCardProps) => {
  const { t } = useTranslation('modelPlan');

  const { id, modelName, basics, collaborators, status } = modelPlan;

  return (
    <Card
      data-testid="single-bookmark-card"
      className={classnames('desktop:grid-col-6', 'grid-col-12', className)}
    >
      <GridContainer>
        <div className="bookmark__header easi-header__basic">
          <h3 className="bookmark__title margin-top-0 margin-bottom-1">
            <UswdsReactLink to={`/models/${id}/task-list`}>
              {modelName}
            </UswdsReactLink>
          </h3>
          <TaskListStatus modelID={id} status={status} />
          <Button
            onClick={() => removeFavorite(id, 'removeFavorite')}
            type="button"
            unstyled
          >
            <IconStar size={5} />
          </Button>
        </div>
        <p className="bookmark__body-text line-height-body-4">
          {basics.goal || ''}
        </p>

        <Divider />
        <div className="bookmark__header easi-header__basic">
          <Grid desktop={{ col: 4 }}>
            <p className="margin-bottom-0">{t(`${type}:favorite.modelLead`)}</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {collaborators
                .filter(
                  collaborator => collaborator.teamRole === TeamRole.MODEL_LEAD
                )
                .map(collaborator => collaborator.fullName)}
            </p>
          </Grid>
          <Grid desktop={{ col: 4 }}>
            <p className="margin-bottom-0">{t(`${type}:favorite.startDate`)}</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {basics.applicationsStart}
            </p>
          </Grid>
          <Grid desktop={{ col: 4 }}>
            <p className="margin-bottom-0">{t(`${type}:favorite.cRTDLs`)}</p>
            {/* TODO: Fill with CR TDL data */}
            <p className="text-bold margin-top-0 margin-bottom-0">CR 1234</p>
          </Grid>
        </div>
      </GridContainer>
    </Card>
  );
};

export default FavoriteCard;
