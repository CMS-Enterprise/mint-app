import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Card,
  Grid,
  GridContainer,
  Icon,
  SummaryBox
} from '@trussworks/react-uswds';
import ModelPlansTable from 'features/Home/Table';
import {
  ModelPlanFilter,
  useGetFavoritesQuery,
  useGetHomepageSettingsQuery,
  ViewCustomizationType
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import Alert from 'components/Alert';
import Divider from 'components/Divider';
import FavoritesCards from 'components/FavoriteCard/table';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import NDABanner from 'components/NDABanner';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import useFavoritePlan from 'hooks/useFavoritePlan';
import useMessage from 'hooks/useMessage';
import { isAssessment, isMAC } from 'utils/user';

import ModelsApproachingClearance from './components/ModelsApproachingClearance';
import ModelsBySolutions from './components/ModelsBySolutions';

import './index.scss';

export type UpdateFavoriteProps = 'addFavorite' | 'removeFavorite';

const Home = () => {
  const { t } = useTranslation('customHome');

  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

  const flags = useFlags();

  const { message } = useMessage();

  const { data, loading } = useGetHomepageSettingsQuery();

  const solutionKeys = data?.userViewCustomization.solutions || [];

  const {
    data: favoritesData,
    loading: favoritesLoading,
    refetch
  } = useGetFavoritesQuery({
    variables: {
      filter: ModelPlanFilter.INCLUDE_ALL
    }
  });

  const favorites = favoritesData?.modelPlanCollection.filter(
    modelPlan => modelPlan.isFavorite
  );

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

  const homepageComponents: Record<ViewCustomizationType, React.ReactNode> = {
    [ViewCustomizationType.MY_MODEL_PLANS]: (
      <>
        <Divider className="margin-y-6" />

        <h2 className="margin-top-0 margin-bottom-2">
          {t(`settings.${ViewCustomizationType.MY_MODEL_PLANS}.heading`)}
        </h2>

        <p>
          {t(`settings.${ViewCustomizationType.MY_MODEL_PLANS}.description`)}
        </p>

        <ModelPlansTable
          id="my-model-plans-table"
          type={ViewCustomizationType.MY_MODEL_PLANS}
          canSearch={false}
          isAssessment={isAssessment(userGroups, flags)}
        />
      </>
    ),
    [ViewCustomizationType.ALL_MODEL_PLANS]: (
      <>
        <Divider className="margin-y-6" />

        <h2 className="margin-top-0">
          {t(`settings.${ViewCustomizationType.ALL_MODEL_PLANS}.heading`)}
        </h2>

        <ModelPlansTable
          id="all-model-plans-table"
          type={ViewCustomizationType.ALL_MODEL_PLANS}
          isAssessment={isAssessment(userGroups, flags)}
        />
      </>
    ),
    [ViewCustomizationType.FOLLOWED_MODELS]: (
      <>
        <Divider className="margin-y-6" />

        <h2 className="margin-top-0 margin-bottom-2">
          {t(`settings.${ViewCustomizationType.FOLLOWED_MODELS}.heading`)}
        </h2>

        <p>
          {t(`settings.${ViewCustomizationType.FOLLOWED_MODELS}.description`)}
        </p>

        <>
          {favoritesLoading && <PageLoading testId="favorites-page-loading" />}
          {!favoritesLoading && favorites && favorites?.length > 0 && (
            <FavoritesCards
              favorites={favorites || []}
              removeFavorite={handleUpdateFavorite}
              toCollaborationArea
            />
          )}
          {!favoritesLoading && !favorites?.length && (
            <Alert
              type="info"
              heading={t(
                `settings.${ViewCustomizationType.FOLLOWED_MODELS}.noResultsHeading`
              )}
              className="margin-y-2"
            >
              <Trans
                i18nKey={`customHome:settings.${ViewCustomizationType.FOLLOWED_MODELS}.noResultsDescription`}
                components={{
                  link1: <UswdsReactLink to="/models"> </UswdsReactLink>,
                  star: (
                    <Icon.StarOutline
                      size={3}
                      style={{ top: '6px' }}
                      aria-label="star"
                    />
                  )
                }}
              />
            </Alert>
          )}
        </>
      </>
    ),
    [ViewCustomizationType.MODELS_WITH_CR_TDL]: (
      <>
        <Divider className="margin-y-6" />

        <h2 className="margin-top-0 margin-bottom-2">
          {t(`settings.${ViewCustomizationType.MODELS_WITH_CR_TDL}.heading`)}
        </h2>

        <p>
          {t(
            `settings.${ViewCustomizationType.MODELS_WITH_CR_TDL}.description`
          )}
        </p>

        <ModelPlansTable
          id="models-with-cr-tdl-table"
          type={ViewCustomizationType.MODELS_WITH_CR_TDL}
          isAssessment={isAssessment(userGroups, flags)}
        />
      </>
    ),
    [ViewCustomizationType.MODELS_APPROACHING_CLEARANCE]: (
      <>
        <Divider className="margin-y-6" />

        <ModelsApproachingClearance />
      </>
    ),
    [ViewCustomizationType.MODELS_BY_SOLUTION]: (
      <>
        <Divider className="margin-y-6" />

        <h2 className="margin-top-0 margin-bottom-2">
          {t(`settings.${ViewCustomizationType.MODELS_BY_SOLUTION}.heading`)}
        </h2>

        {solutionKeys.length > 0 && (
          <p>
            {t(
              `settings.${ViewCustomizationType.MODELS_BY_SOLUTION}.description`
            )}
          </p>
        )}

        <ModelsBySolutions solutionKeys={solutionKeys} />
      </>
    ),
    [ViewCustomizationType.MODELS_BY_GROUP]: (
      <>
        <Divider className="margin-y-6" />

        {/* <ModelsByGroup /> */}
      </>
    )
  };

  const renderView = () => {
    if (isUserSet) {
      return (
        <>
          <NDABanner collapsable />
          <GridContainer>
            {message}

            <Grid data-testid="homepage">
              <Grid row className="padding-top-4">
                <Grid desktop={{ col: 9 }}>
                  <div>
                    <PageHeading className="margin-bottom-1 margin-top-0">
                      {t('title')}
                    </PageHeading>

                    <p className="line-height-body-5 font-body-lg text-light margin-top-0 margin-bottom-3">
                      {!isMAC(userGroups)
                        ? t('subheading')
                        : t('macSubheading')}
                    </p>
                  </div>
                </Grid>

                <Grid desktop={{ col: 3 }}>
                  <Card className="margin-y-0 home__card display-flex">
                    <p className="text-bold margin-top-0">
                      {t('customizeHomepage')}
                    </p>

                    <div>
                      <UswdsReactLink
                        variant="unstyled"
                        to="/homepage-settings/form"
                        className="display-flex flex-align-center"
                      >
                        <Icon.Edit
                          className="margin-right-1 text-primary"
                          aria-label="edit"
                        />
                        {t('editHomepage')}
                      </UswdsReactLink>
                    </div>
                  </Card>
                </Grid>
              </Grid>

              {!isMAC(userGroups) && (
                <SummaryBox className="bg-base-lightest border-0 radius-0 padding-2 padding-bottom-3">
                  <p className="margin-0 margin-bottom-1">
                    {t('newModelSummaryBox.copy')}
                  </p>

                  <UswdsReactLink
                    className="usa-button"
                    variant="unstyled"
                    to="/models/steps-overview"
                  >
                    {t('newModelSummaryBox.cta')}
                  </UswdsReactLink>
                </SummaryBox>
              )}

              {!loading &&
                data?.userViewCustomization.viewCustomization.length === 0 && (
                  <Alert type="info" heading={t('emptyHome')}>
                    <div className="display-flex flex-align-center">
                      <UswdsReactLink
                        variant="unstyled"
                        to="/homepage-settings/form"
                        className="margin-right-1"
                      >
                        {t('editHomepage')}
                      </UswdsReactLink>
                      <Icon.ArrowForward aria-label="forward" />
                    </div>
                  </Alert>
                )}

              {loading ? (
                <PageLoading />
              ) : (
                data?.userViewCustomization.viewCustomization.map(
                  customization => {
                    if (
                      !flags.modelsApproachingClearanceEnabled &&
                      customization ===
                        ViewCustomizationType.MODELS_APPROACHING_CLEARANCE
                    ) {
                      return null;
                    }
                    return (
                      <div key={customization}>
                        {homepageComponents[customization]}
                      </div>
                    );
                  }
                )
              )}

              <SummaryBox className="bg-base-lightest border-0 radius-0 padding-2 padding-bottom-3 margin-top-6">
                <p className="margin-0 margin-bottom-1">
                  {t('allModels.copy')}
                </p>

                <UswdsReactLink variant="unstyled" to="/models">
                  {t('allModels.cta')}
                </UswdsReactLink>
              </SummaryBox>
            </Grid>
          </GridContainer>
        </>
      );
    }
    return <NDABanner />;
  };

  return <MainContent>{renderView()}</MainContent>;
};

export default Home;
