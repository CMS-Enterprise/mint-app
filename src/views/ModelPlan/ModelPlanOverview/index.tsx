import React from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Alert,
  Grid,
  GridContainer,
  IconStarOutline,
  SummaryBox
} from '@trussworks/react-uswds';

import FavoritesTable from 'components/FavoriteCard/table';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import NDABanner from 'components/NDABanner';
import PageHeading from 'components/PageHeading';
import useFavoritePlan from 'hooks/useFavoritePlan';
import useMessage from 'hooks/useMessage';
import GetAllModelPlans from 'queries/ReadOnly/GetAllModelPlans';
import {
  GetAllModelPlans as GetAllModelPlansType,
  GetAllModelPlans_modelPlanCollection as AllModelPlansType
} from 'queries/ReadOnly/types/GetAllModelPlans';

import Table from '../ReadOnly/Table';

export type UpdateFavoriteProps = 'addFavorite' | 'removeFavorite';

const ModelPlan = () => {
  const { t } = useTranslation('readOnlyModelPlan');
  const { t: h } = useTranslation('home');

  const { error, data, refetch } = useQuery<GetAllModelPlansType>(
    GetAllModelPlans
  );

  const modelPlans = (data?.modelPlanCollection ?? []) as AllModelPlansType[];

  const favorites = modelPlans.filter(modelPlan => modelPlan.isFavorite);

  const favoriteMutations = useFavoritePlan();

  const handleUpdateFavorite = (
    modelPlanID: string,
    type: UpdateFavoriteProps
  ) => {
    favoriteMutations[type]({
      variables: {
        modelPlanID
      }
    }).then(refetch);
  };

  const { message } = useMessage();

  return (
    <MainContent data-testid="model-plan-overview">
      <NDABanner collapsable className="margin-top-0" />
      <GridContainer>
        <Grid className="padding-bottom-6 margin-bottom-4 border-bottom border-base-light">
          {message}
          <PageHeading className="margin-bottom-1">{t('heading')}</PageHeading>
          <p className="line-height-body-5 font-body-lg text-light margin-bottom-05 margin-top-0">
            {t('subheading')}
          </p>
          <UswdsReactLink variant="unstyled" to="/models#all-models">
            {t('allModelsLink')}
          </UswdsReactLink>
          <SummaryBox
            heading=""
            className="bg-base-lightest border-0 radius-0 padding-2 padding-bottom-3 margin-top-3 "
          >
            <p className="margin-0 margin-bottom-1">
              {h('newModelSummaryBox.copy')}
            </p>
            <UswdsReactLink
              className="usa-button usa-button--outline"
              variant="unstyled"
              to="/models/steps-overview"
            >
              {h('newModelSummaryBox.cta')}
            </UswdsReactLink>
          </SummaryBox>
        </Grid>

        <Grid
          desktop={{ col: 12 }}
          className="padding-bottom-2 margin-bottom-4 border-bottom border-base-light"
        >
          <div className="margin-bottom-1 font-heading-2xl text-bold">
            {t('following.heading')}
          </div>
          <p className="line-height-body-5 text-light margin-bottom-05 margin-top-0 margin-bottom-3">
            {t('following.subheading')}
          </p>

          {favorites.length ? (
            <FavoritesTable
              favorites={favorites}
              removeFavorite={handleUpdateFavorite}
            />
          ) : (
            <Alert
              type="info"
              heading={t('following.alert.heading')}
              className="margin-bottom-2"
            >
              <span className="display-flex flex-align-center flex-wrap margin-0 ">
                {t('following.alert.subheadingPartA')}
                <span className="display-flex flex-align-center margin-x-05">
                  (<IconStarOutline size={3} />)
                </span>

                {t('following.alert.subheadingPartB')}
              </span>
            </Alert>
          )}
        </Grid>
        <Grid>
          <div
            className="margin-bottom-1 font-heading-2xl text-bold"
            id="all-models"
          >
            {t('allModels.heading')}
          </div>
          <p className="line-height-body-5 text-light margin-bottom-3 margin-top-0">
            {t('allModels.subheading')}
          </p>
          {error && <div>{JSON.stringify(error)}</div>}
          {!error && (
            <Table data={modelPlans} updateFavorite={handleUpdateFavorite} />
          )}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default withRouter(ModelPlan);
