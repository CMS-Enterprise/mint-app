import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Button,
  Grid,
  GridContainer,
  Icon,
  SummaryBox
} from '@trussworks/react-uswds';
import {
  GetFavoritesQuery,
  ModelPlanFilter,
  useGetFavoritesQuery,
  ViewCustomizationType
} from 'gql/gen/graphql';

import FavoritesTable from 'components/FavoriteCard/table';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import NDABanner from 'components/NDABanner';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import useFavoritePlan from 'hooks/useFavoritePlan';
import useMessage from 'hooks/useMessage';
import { AppState } from 'reducers/rootReducer';
import { isMAC } from 'utils/user';

import ModelPlansTable from '../HomeTable';

type GetFavoritesModelPlanCollection = GetFavoritesQuery['modelPlanCollection'][0];

export type UpdateFavoriteProps = 'addFavorite' | 'removeFavorite';

const ModelPlan = () => {
  const { t } = useTranslation('readOnlyModelPlan');
  const { t: h } = useTranslation('customHome');

  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const macUser = isMAC(userGroups);

  const { data, loading, refetch } = useGetFavoritesQuery({
    variables: {
      filter: ModelPlanFilter.INCLUDE_ALL,
      isMAC: true
    }
  });

  const modelPlans = (data?.modelPlanCollection ??
    []) as GetFavoritesModelPlanCollection[];

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
    }).then(() => refetch());
  };

  const { message } = useMessage();

  const Favorites = favorites.length ? (
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
          (<Icon.StarOutline size={3} />)
        </span>

        {t('following.alert.subheadingPartB')}
      </span>
    </Alert>
  );

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

          <Button
            type="button"
            onClick={() =>
              document.querySelector('.model-plan-table')?.scrollIntoView()
            }
            className="usa-button--unstyled"
          >
            {t('allModelsLink')}
          </Button>

          {!macUser && (
            <SummaryBox className="bg-base-lightest border-0 radius-0 padding-2 padding-bottom-3 margin-top-3 ">
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
          )}
        </Grid>

        <Grid
          desktop={{ col: 12 }}
          className="padding-bottom-2 margin-bottom-4 border-bottom border-base-light"
        >
          <div className="margin-bottom-1 font-heading-xl text-bold">
            {t('following.heading')}
          </div>

          <p className="line-height-body-5 text-light margin-bottom-05 margin-top-0 margin-bottom-3">
            {t('following.subheading')}
          </p>
          {loading && !favorites.length ? <PageLoading /> : Favorites}
        </Grid>

        <Grid>
          <div
            className="margin-bottom-1 font-heading-xl text-bold"
            id="all-models"
          >
            {h('allModels.heading')}
          </div>

          <p className="line-height-body-5 text-light margin-bottom-3 margin-top-0">
            {h('allModels.subheading')}
          </p>

          <ModelPlansTable
            type={ViewCustomizationType.ALL_MODEL_PLANS}
            isHome={false}
            updateFavorite={handleUpdateFavorite}
          />
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default withRouter(ModelPlan);
