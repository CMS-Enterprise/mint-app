import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';
// import classNames from 'classnames';
import {
  //   GetCrtdLsQuery,
  GetModelPlanQuery,
  useGetModelPlanQuery
} from 'gql/gen/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
// import { useFlags } from 'launchdarkly-react-client-sdk';
// import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
// import Divider from 'components/shared/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import UpdateStatusModal from 'components/UpdateStatusModal';
import useMessage from 'hooks/useMessage';

// import { formatDateLocal } from 'utils/date';
// import { isAssessment } from 'utils/user';
// import { SubscriptionContext } from 'views/SubscriptionWrapper';
// import Discussions from '../Discussions';
// import DiscussionModalWrapper from '../Discussions/DiscussionModalWrapper';
import TaskListStatus from '../TaskList/_components/TaskListStatus';

import './index.scss';

type GetModelPlanTypes = GetModelPlanQuery['modelPlan'];
// type DiscussionType = GetModelPlanQuery['modelPlan']['discussions'][0];
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

  //   const location = useLocation();

  //   const params = useMemo(() => {
  //     return new URLSearchParams(location.search);
  //   }, [location.search]);

  //   // Get discussionID from generated email link
  //   const discussionID = params.gecollaborationAreaT('discussionID');

  //   const flags = useFlags();

  //   const [isDiscussionOpen, setIsDiscussionOpen] = useState<boolean>(false);

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
    // discussions,
    // documents,
    // crs,
    // tdls,
    status,
    // collaborators,
    suggestedPhase
  } = modelPlan;

  //   const planCRs = crs || [];
  //   const planTDLs = tdls || [];

  //   const crTdls = [...planCRs, ...planTDLs] as CRTDLType[];

  // Gets the sessions storage variable for statusChecked of modelPlan
  const statusCheckedStorage =
    sessionStorage.getItem(`statusChecked-${modelID}`) === 'true';

  // Aligns session with default value of state
  const [statusChecked, setStatusChecked] = useState<boolean>(
    statusCheckedStorage
  );

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

  //   useEffect(() => {
  //     if (discussionID) setIsDiscussionOpen(true);
  //   }, [discussionID]);

  return (
    <MainContent
      className="collaboration-area"
      data-testid="collaboration-area"
    >
      <GridContainer>
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
        {loading && (
          <div className="height-viewport">
            <PageLoading />
          </div>
        )}

        {!loading && data && (
          <Grid row gap>
            <Grid desktop={{ col: 12 }}>
              <PageHeading className="margin-top-4 margin-bottom-0">
                {collaborationAreaT('heading')}
              </PageHeading>
              <p
                className="margin-top-0 margin-bottom-2 font-body-lg"
                data-testid="model-plan-name"
              >
                {collaborationAreaT('modelPlan', {
                  modelName
                })}
              </p>

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

              {/* Discussion modal */}
              {/* {isDiscussionOpen && (
                <DiscussionModalWrapper
                  isOpen={isDiscussionOpen}
                  closeModal={() => setIsDiscussionOpen(false)}
                >
                  <Discussions modelID={modelID} discussionID={discussionID} />
                </DiscussionModalWrapper>
              )} */}

              <TaskListStatus
                modelID={modelID}
                status={status}
                updateLabel
                statusLabel
                isCollaborationArea
              />
            </Grid>
          </Grid>
        )}
      </GridContainer>
    </MainContent>
  );
};

export default CollaborationArea;
