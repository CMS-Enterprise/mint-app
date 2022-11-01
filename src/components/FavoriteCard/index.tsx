import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  Grid,
  IconStar,
  IconStarOutline,
  Tag
} from '@trussworks/react-uswds';
import classnames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import Divider from 'components/shared/Divider';
import { GetAllModelPlans_modelPlanCollection as ModelPlanType } from 'queries/ReadOnly/types/GetAllModelPlans';
import { TeamRole } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';
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
  const { t: h } = useTranslation('home');

  const {
    id,
    basics,
    collaborators,
    crTdls,
    modelName,
    nameHistory,
    status
  } = modelPlan;

  const filteredList = nameHistory.slice(1);
  const firstThreeNames = filteredList.slice(0, 3).join(', ');

  const crtdlIDs = crTdls.map(crtdl => crtdl.idNumber);

  return (
    <Card
      data-testid={modelName}
      className={classnames('grid-col-12', className)}
    >
      <div>
        <div className="bookmark__header easi-header__basic">
          <div className="display-flex bookmark__title">
            <Button
              onClick={() => removeFavorite(id, 'removeFavorite')}
              type="button"
              className="margin-right-2 width-auto"
              unstyled
            >
              <IconStar size={5} />
            </Button>
            <h3 className="bookmark__title margin-0">
              <UswdsReactLink to={`/models/${id}/read-only`}>
                {modelName}
              </UswdsReactLink>
            </h3>
          </div>
          <TaskListStatus modelID={id} status={status} />
        </div>
        <p className="margin-y-0 font-body-xs line-height-sans-2">
          {h('previously')} {firstThreeNames}{' '}
          {filteredList.length > 3 ??
            `+ ${filteredList.length - 3} ${h('more')}`}
        </p>
        <p className="bookmark__body-text line-height-body-4">
          {basics.goal || ''}
        </p>

        <Divider />
        <Grid row>
          <Grid desktop={{ col: 4 }}>
            <p className="margin-bottom-0">{t(`${type}:favorite.modelLead`)}</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {collaborators
                .filter(
                  collaborator => collaborator.teamRole === TeamRole.MODEL_LEAD
                )
                .map((collaborator, index) =>
                  index === collaborators.length - 1
                    ? collaborator.fullName
                    : `${collaborator.fullName}, `
                )}
            </p>
          </Grid>
          <Grid desktop={{ col: 4 }}>
            <p className="margin-bottom-0">{t(`${type}:favorite.startDate`)}</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {basics.applicationsStart ? (
                formatDate(basics.applicationsStart)
              ) : (
                <i>{t('favorite.toBeDetermined')}</i>
              )}
            </p>
          </Grid>
          <Grid desktop={{ col: 4 }}>
            <p className="margin-bottom-0">{t(`${type}:favorite.cRTDLs`)}</p>
            {/* TODO: Fill with CR TDL data */}
            <p className="text-bold margin-top-0 margin-bottom-0">
              {crtdlIDs.length ? (
                crtdlIDs.join(', ')
              ) : (
                <i>{t('favorite.noneEntered')}</i>
              )}
            </p>
          </Grid>
        </Grid>
      </div>
    </Card>
  );
};

type FavoriteIconProps = {
  className?: string;
  isFavorite: boolean;
  modelPlanID: string;
  updateFavorite: (modelPlanID: string, type: UpdateFavoriteProps) => void;
};

// Icon favorite tag/toggle for readonly summary box
export const FavoriteIcon = ({
  className,
  modelPlanID,
  isFavorite,
  updateFavorite
}: FavoriteIconProps) => {
  const { t } = useTranslation('modelPlan');

  return (
    <div className={classnames('pointer', className)}>
      <Tag
        className="text-primary bg-white bookmark__tag padding-1 padding-x-105"
        onClick={() =>
          isFavorite
            ? updateFavorite(modelPlanID, 'removeFavorite')
            : updateFavorite(modelPlanID, 'addFavorite')
        }
      >
        {isFavorite ? (
          <IconStar className="margin-right-05 bookmark__tag__icon" />
        ) : (
          <IconStarOutline className="margin-right-05 bookmark__tag__icon" />
        )}

        {isFavorite ? t('favorite.following') : t('favorite.follow')}
      </Tag>
    </div>
  );
};

export default FavoriteCard;
