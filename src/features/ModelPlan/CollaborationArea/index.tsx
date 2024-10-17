import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CardGroup, Grid, GridContainer } from '@trussworks/react-uswds';
import { HelpArticle } from 'features/HelpAndKnowledge/Articles';
import RelatedArticles from 'features/HelpAndKnowledge/Articles/_components/RelatedArticles';
import { GetModelPlanQuery, useGetModelPlanQuery } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import Divider from 'components/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import { FavoriteIcon } from 'components/FavoriteCard';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import ShareExportButton from 'components/ShareExport/ShareExportButton';
import StatusBanner from 'components/StatusBanner';
import UpdateStatusModal from 'components/UpdateStatusModal';
import useFavoritePlan from 'hooks/useFavoritePlan';
import useMessage from 'hooks/useMessage';

import { UpdateFavoriteProps } from '../ModelPlanOverview';

import DataExchangeApproachCard from './Cards/DataExchangeApproachCard';
import DiscussionsCard from './Cards/DiscussionsCard';
import DocumentsCard from './Cards/DocumentsCard';
import ModelPlanCard from './Cards/ModelPlanCard';
import TeamCard from './Cards/TeamCard';

import './index.scss';

type GetModelPlanTypes = GetModelPlanQuery['modelPlan'];

export type StatusMessageType = {
  message: string;
  status: 'success' | 'error';
};

const CollaborationArea = () => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const { modelID } = useParams<{ modelID: string }>();

  const { message } = useMessage();

  const [statusMessage, setStatusMessage] = useState<StatusMessageType | null>(
    null
  );

  const { data, loading, error, refetch } = useGetModelPlanQuery({
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || ({} as GetModelPlanTypes);

  const {
    modelName,
    discussions,
    documents,
    dataExchangeApproach,
    status,
    collaborators,
    isFavorite,
    suggestedPhase
  } = modelPlan;

  // Gets the sessions storage variable for statusChecked of modelPlan
  const statusCheckedStorage =
    sessionStorage.getItem(`statusChecked-${modelID}`) === 'true';

  // Aligns session with default value of state
  const [statusChecked, setStatusChecked] =
    useState<boolean>(statusCheckedStorage);

  // Status phase modal state
  const [isStatusPhaseModalOpen, setStatusPhaseModalOpen] = useState<boolean>(
    !!suggestedPhase || false
  );

  // Updates state if session value changes
  useEffect(() => {
    setStatusChecked(statusCheckedStorage);
  }, [statusCheckedStorage]);

  // Sets the modal open state based on session state and suggested phase
  useEffect(() => {
    if (suggestedPhase && !statusChecked) setStatusPhaseModalOpen(true);
  }, [suggestedPhase, statusChecked]);

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

  return (
    <MainContent
      className="collaboration-area"
      data-testid="collaboration-area"
    >
      <GridContainer className="margin-bottom-4">
        <Grid desktop={{ col: 12 }}>
          <Breadcrumbs
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.COLLABORATION_AREA
            ]}
          />
        </Grid>

        {error && (
          <ErrorAlert
            testId="formik-validation-errors"
            classNames="margin-top-3"
            heading={collaborationAreaT('errorHeading')}
          >
            <ErrorAlertMessage
              errorKey="error-document"
              message={collaborationAreaT('errorMessage')}
            />
          </ErrorAlert>
        )}

        {message && (
          <Alert slim type="success">
            {message}
          </Alert>
        )}

        {!loading && statusMessage && (
          <Alert slim type={statusMessage.status} closeAlert={setStatusMessage}>
            {statusMessage.message}
          </Alert>
        )}

        {/* Wait for model status query param to be removed */}
        {!data && (
          <div className="height-viewport">
            <PageLoading />
          </div>
        )}

        {data && (
          <Grid>
            <Grid row className="collaboration-area__header">
              <Grid desktop={{ col: 9 }}>
                <PageHeading className="margin-top-4 margin-bottom-0">
                  {collaborationAreaT('heading')}
                </PageHeading>
                <p
                  className="margin-top-1 margin-bottom-2 font-body-lg"
                  data-testid="model-plan-name"
                >
                  {collaborationAreaT('modelPlan', {
                    modelName
                  })}
                </p>
              </Grid>

              <Grid desktop={{ col: 3 }} className="margin-top-4">
                <div className="display-flex flex-justify-end">
                  <FavoriteIcon
                    isFavorite={isFavorite}
                    modelPlanID={modelID}
                    updateFavorite={handleUpdateFavorite}
                    isCollaborationArea
                  />

                  <ShareExportButton
                    modelID={modelID}
                    setStatusMessage={setStatusMessage}
                  />
                </div>
              </Grid>
            </Grid>

            <Grid desktop={{ col: 12 }}>
              <StatusBanner
                modelID={modelID}
                status={status}
                updateLabel
                statusLabel
                isCollaborationArea
                modifiedDts={modelPlan.modifiedDts}
                modifiedOrCreateLabel
              />
            </Grid>

            <Divider className="margin-y-6" />

            <Grid row gap>
              <Grid col={12}>
                <h2 className="margin-top-0">{collaborationAreaT('areas')}</h2>
                <CardGroup>
                  <ModelPlanCard
                    modelID={modelID}
                    setStatusMessage={setStatusMessage}
                  />

                  <DataExchangeApproachCard
                    modelID={modelID}
                    dataExhangeApproachData={dataExchangeApproach}
                  />
                </CardGroup>
              </Grid>
            </Grid>
          </Grid>
        )}

        {!!modelPlan.suggestedPhase && !statusChecked && (
          <UpdateStatusModal
            modelID={modelID}
            isOpen={isStatusPhaseModalOpen}
            closeModal={() => {
              sessionStorage.setItem(`statusChecked-${modelID}`, 'true');
              setStatusPhaseModalOpen(false);
            }}
            currentStatus={status}
            suggestedPhase={modelPlan.suggestedPhase}
            setStatusMessage={setStatusMessage}
            refetch={refetch}
          />
        )}
      </GridContainer>

      <div className="bg-primary-lighter padding-y-6">
        <GridContainer>
          <CardGroup>
            <TeamCard modelID={modelID} collaborators={collaborators} />

            <DiscussionsCard discussions={discussions} modelID={modelID} />

            <DocumentsCard documents={documents} modelID={modelID} />
          </CardGroup>
        </GridContainer>
      </div>

      <RelatedArticles
        implementationType="Additional Resources"
        specificArticles={[
          HelpArticle.HIGH_LEVEL_PROJECT_PLAN,
          HelpArticle.TWO_PAGER_MEETING,
          HelpArticle.SIX_PAGER_MEETING
        ]}
        viewAllLink
      />
    </MainContent>
  );
};

export default CollaborationArea;
