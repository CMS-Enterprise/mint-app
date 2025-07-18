import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Card, Grid, Icon, Tag } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { UpdateFavoriteProps } from 'features/ModelPlan/ModelPlanOverview';
import { GetFavoritesQuery, TeamRole } from 'gql/generated/graphql';
import i18next from 'i18next';

import Divider from 'components/Divider';
import UswdsReactLink from 'components/LinkWrapper';
import ModelStatusTag from 'components/ModelStatusTag';
import useCheckResponsiveScreen from 'hooks/useCheckMobile';
import { formatDateUtc } from 'utils/date';

import './index.scss';

type FavoritesModelType = GetFavoritesQuery['modelPlanCollection'][0];

type FavoriteCardProps = {
  className?: string;
  type?: 'miscellaneous'; // Built in for future iterations/varations of favorited datasets that ingest i18n translations for headers.
  modelPlan: FavoritesModelType;
  removeFavorite: (modelPlanID: string, type: UpdateFavoriteProps) => void;
  toCollaborationArea?: boolean;
};

const FavoriteCard = ({
  className,
  type = 'miscellaneous',
  modelPlan,
  removeFavorite,
  toCollaborationArea = false
}: FavoriteCardProps) => {
  const { t } = useTranslation('miscellaneous');
  const { t: h } = useTranslation('customHome');

  const {
    id,
    basics,
    timeline,
    collaborators,
    echimpCRsAndTDLs,
    modelName,
    nameHistory,
    status
  } = modelPlan;

  const filteredList = nameHistory.slice(1);
  const firstThreeNames = filteredList.slice(0, 3).join(', ');

  const crtdlIDs = echimpCRsAndTDLs.map(crtdl => crtdl.id);
  const firstThreeCRTDLs = crtdlIDs.slice(0, 3);
  const remainingCRTDLs: number = crtdlIDs.length - firstThreeCRTDLs.length;

  const isMobile = useCheckResponsiveScreen('mobile', 'smaller');

  return (
    <Card
      data-testid={modelName}
      className={classNames('grid-col-12', className)}
    >
      <div>
        <div className="bookmark__header easi-header__basic">
          <Grid tablet={{ col: 9 }} mobile={{ col: 12 }}>
            <div className="display-flex bookmark__title">
              <Button
                onClick={() => removeFavorite(id, 'removeFavorite')}
                type="button"
                className="margin-right-2 width-auto"
                unstyled
              >
                <Icon.Star size={5} aria-label="star" />
              </Button>
              <h3 className="bookmark__title margin-0">
                <UswdsReactLink
                  to={`/models/${id}/${
                    toCollaborationArea ? 'collaboration-area' : 'read-view'
                  }`}
                >
                  {modelName}
                </UswdsReactLink>
              </h3>
            </div>
          </Grid>
          <Grid
            tablet={{ col: 3 }}
            mobile={{ col: 12 }}
            className="display-flex flex-justify-end"
          >
            <ModelStatusTag status={status} />
          </Grid>
        </div>
        {nameHistory && nameHistory.length > 1 && (
          <p className="margin-y-0 font-body-xs line-height-sans-2">
            {h('previously')} {firstThreeNames}{' '}
            {filteredList.length > 3 &&
              `+ ${filteredList.length - 3} ${h('more')}`}
          </p>
        )}
        <p className="bookmark__body-text line-height-body-4">
          {basics.goal || ''}
        </p>

        <Divider />
        <Grid row>
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
              {timeline.performancePeriodStarts ? (
                formatDateUtc(timeline.performancePeriodStarts, 'MMMM d, yyyy')
              ) : (
                <i>{t('favorite.toBeDetermined')}</i>
              )}
            </p>
          </Grid>
          <Grid tablet={{ col: 4 }} mobile={{ col: isMobile ? 6 : 12 }}>
            <p className="margin-bottom-0">{t(`${type}:favorite.cRTDLs`)}</p>
            <p className="text-bold margin-top-0 margin-bottom-0">
              {crtdlIDs.length ? (
                <>
                  {firstThreeCRTDLs.join(', ')}
                  {remainingCRTDLs > 0 && (
                    <>
                      {' '}
                      {i18next.t('collaborationArea:crtdlsCard.andMore', {
                        count: remainingCRTDLs
                      })}
                    </>
                  )}
                </>
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
  isCollaborationArea?: boolean;
};

// Icon favorite tag/toggle for readonly summary box
export const FavoriteIcon = ({
  className,
  modelPlanID,
  isFavorite,
  updateFavorite,
  isCollaborationArea
}: FavoriteIconProps) => {
  const { t } = useTranslation('miscellaneous');

  return (
    <Tag
      className={classNames(
        'text-primary text-bold bookmark__tag padding-y-1 padding-x-2 bg-white pointer',
        {
          'bg-primary-lighter': isCollaborationArea
        }
      )}
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.code !== 'Space') {
          return;
        }
        e.preventDefault();
        if (isFavorite) {
          updateFavorite(modelPlanID, 'removeFavorite');
        } else {
          updateFavorite(modelPlanID, 'addFavorite');
        }
      }}
      onClick={() => {
        if (isFavorite) {
          updateFavorite(modelPlanID, 'removeFavorite');
        } else {
          updateFavorite(modelPlanID, 'addFavorite');
        }
      }}
    >
      {isFavorite ? (
        <Icon.Star
          className="margin-right-1 bookmark__tag__icon"
          aria-label="star"
        />
      ) : (
        <Icon.StarOutline
          className="margin-right-1 bookmark__tag__icon"
          aria-label="star outline"
        />
      )}

      <span className="bookmark__text">
        {isFavorite ? t('favorite.following') : t('favorite.follow')}
      </span>
    </Tag>
  );
};

export default FavoriteCard;
