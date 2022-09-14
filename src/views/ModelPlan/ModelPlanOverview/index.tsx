import React from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  CardGroup,
  Grid,
  GridContainer,
  IconStarOutline,
  SummaryBox
} from '@trussworks/react-uswds';

import FavoriteCard from 'components/FavoriteCard';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import NDABanner from 'components/NDABanner';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import AddPlanFavorite from 'queries/Favorite/AddPlanFavorite';
import DeletePlanFavorite from 'queries/Favorite/DeletePlanFavorite';
import { AddPlanFavoriteVariables } from 'queries/Favorite/types/AddPlanFavorite';
import { DeletePlanFavoriteVariables } from 'queries/Favorite/types/DeletePlanFavorite';
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

  const { error, loading, data, refetch } = useQuery<GetAllModelPlansType>(
    GetAllModelPlans
  );

  const modelPlans = (data?.modelPlanCollection ?? []) as AllModelPlansType[];

  const favorites = modelPlans.filter(modelPlan => modelPlan.isFavorite);

  const [addMutate] = useMutation<AddPlanFavoriteVariables>(AddPlanFavorite);

  const [removeMutate] = useMutation<DeletePlanFavoriteVariables>(
    DeletePlanFavorite
  );

  const favoriteMutations = {
    removeFavorite: removeMutate,
    addFavorite: addMutate
  };

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

  return (
    <MainContent data-testid="model-plan-overview">
      <NDABanner collapsable className="margin-top-0" />
      <GridContainer>
        <Grid className="padding-bottom-6 margin-bottom-4 border-bottom border-base-light">
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
          <PageHeading className="margin-bottom-1">
            {t('following.heading')}
          </PageHeading>
          <p className="line-height-body-5 text-light margin-bottom-05 margin-top-0 margin-bottom-3">
            {t('following.subheading')}
          </p>

          {favorites.length ? (
            <CardGroup className="margin-bottom-3">
              {favorites.map(modelPlan => (
                <FavoriteCard
                  key={modelPlan.id}
                  modelPlan={modelPlan}
                  removeFavorite={handleUpdateFavorite}
                />
              ))}
            </CardGroup>
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
          <PageHeading className="margin-bottom-1" id="all-models">
            {t('allModels.heading')}
          </PageHeading>
          <p className="line-height-body-5 text-light margin-bottom-3 margin-top-0">
            {t('allModels.subheading')}
          </p>
          {loading && <PageLoading />}
          {error && <div>{JSON.stringify(error)}</div>}
          {!loading && !error && (
            <Table data={modelPlans} updateFavorite={handleUpdateFavorite} />
          )}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default withRouter(ModelPlan);
