import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CardGroup, Grid, GridContainer } from '@trussworks/react-uswds';
// import classNames from 'classnames';
import {
  //   GetCrtdLsQuery,
  GetModelPlanQuery,
  useGetModelPlanQuery
} from 'gql/gen/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import { FavoriteIcon } from 'components/FavoriteCard';
// import UswdsReactLink from 'components/LinkWrapper';
// import { useFlags } from 'launchdarkly-react-client-sdk';
// import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
// import Divider from 'components/shared/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import ShareExportButton from 'components/ShareExport/ShareExportButton';
import StatusBanner from 'components/StatusBanner';
import UpdateStatusModal from 'components/UpdateStatusModal';
import useFavoritePlan from 'hooks/useFavoritePlan';
import useMessage from 'hooks/useMessage';

import { UpdateFavoriteProps } from '../ModelPlanOverview';

import DiscussionsCard from './Cards/DiscussionsCard';
// import { formatDateLocal } from 'utils/date';
// import { isAssessment } from 'utils/user';
// import { SubscriptionContext } from 'views/SubscriptionWrapper';
import DocumentsCard from './Cards/DocumentsCard';
import ModelPlanCard from './Cards/ModelPlanCard';
import TeamCard from './Cards/TeamCard';

import './index.scss';

type GetModelPlanTypes = GetModelPlanQuery['modelPlan'];
// type DocumentType = GetModelPlanQuery['modelPlan']['documents'][0];

// type CRTDLType =
//   | GetCrtdLsQuery['modelPlan']['crs'][0]
//   | GetCrtdLsQuery['modelPlan']['tdls'][0];

export type StatusMessageType = {
  message: string;
  status: 'success' | 'error';
};

const CollaborationArea = () => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const { modelID } = useParams<{ modelID: string }>();

  const { message } = useMessage();

  //   const flags = useFlags();

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
    // crs,
    // tdls,
    status,
    // collaborators,
    isFavorite,
    suggestedPhase
  } = modelPlan;

  //   const planCRs = crs || [];
  //   const planTDLs = tdls || [];

  //   const crTdls = [...planCRs, ...planTDLs] as CRTDLType[];

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

      <div className="bg-primary-lighter padding-top-6 padding-bottom-10 margin-bottom-neg-7">
        <GridContainer>
          <CardGroup>
            <TeamCard
              modelID={modelID}
              collaborators={modelPlan.collaborators}
            />

            <DiscussionsCard discussions={discussions} modelID={modelID} />

            <DocumentsCard documents={documents} modelID={modelID} />
          </CardGroup>
        </GridContainer>
      </div>
    </MainContent>
  );
};

export default CollaborationArea;
