import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams
} from 'react-router-dom';
import { Button, Grid, GridContainer } from '@trussworks/react-uswds';
import {
  DeleteModelPlanCollaboratorMutation,
  GetModelCollaboratorsQuery,
  TeamRole,
  useDeleteModelPlanCollaboratorMutation,
  useGetModelCollaboratorsQuery
} from 'gql/gen/graphql';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import Expire from 'components/shared/Expire';
import useMessage from 'hooks/useMessage';
import { collaboratorsOrderedByModelLeads } from 'utils/modelPlan';
import ProtectedRoute from 'views/App/ProtectedRoute';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import NotFound from 'views/NotFound';

import AddCollaborator from './AddCollaborator';
import CollaboratorsTable from './table';

type ModelPlanCollaboratorType = DeleteModelPlanCollaboratorMutation['deletePlanCollaborator'];
type GetCollaboratorsType = GetModelCollaboratorsQuery['modelPlan']['collaborators'][0];

// Checking if there is only one collaborator with role of MODEL_LEAD - can't edit or remove if so
export const isLastModelLead = (collaborators: GetCollaboratorsType[]) => {
  const modelLeads = collaborators.filter(collaborator =>
    collaborator.teamRoles.includes(TeamRole.MODEL_LEAD)
  );
  return !(modelLeads.length > 1);
};

const SuccessRemovalMessage = ({
  modelName
}: {
  modelName: string | undefined;
}) => {
  const { t: collaboratorsMiscT } = useTranslation('collaboratorsMisc');
  return (
    <Alert
      type="success"
      data-testid="mandatory-fields-alert"
      className="margin-y-4"
      heading={collaboratorsMiscT('success.heading', {
        modelName
      })}
    >
      <span className="mandatory-fields-alert__text">
        {collaboratorsMiscT('success.message')}
      </span>
    </Alert>
  );
};

export const CollaboratorsContent = () => {
  const { modelID } = useParams<{ modelID: string }>();

  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { t: collaboratorsMiscT } = useTranslation('collaboratorsMisc');

  const history = useHistory();

  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const manageOrAdd = params.get('view') || 'manage';

  const { message, showMessageOnNextPage } = useMessage();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLastLead, setIsLastLead] = useState(false);

  const [
    removeCollaborator,
    setRemoveCollaborator
  ] = useState<ModelPlanCollaboratorType>();

  // Current user's EUA id - to warn about removing yourself from model plan
  const { euaId } = useSelector((state: RootStateOrAny) => state.auth);

  const [mutate] = useDeleteModelPlanCollaboratorMutation();

  const { error, data, refetch, loading } = useGetModelCollaboratorsQuery({
    variables: {
      id: modelID
    }
  });

  const collaborators = useMemo(() => {
    return (data?.modelPlan?.collaborators ?? []) as GetCollaboratorsType[];
  }, [data?.modelPlan?.collaborators]);

  const { modelName } = useContext(ModelInfoContext);

  // Setting state of isLastLead to toggle edit/remove links
  useEffect(() => {
    setIsLastLead(isLastModelLead(collaborators));
  }, [collaborators]);

  const handleRemoveCollaborator = (
    collaborator: ModelPlanCollaboratorType
  ) => {
    mutate({
      variables: {
        id: collaborator.id
      }
    })
      .then(response => {
        if (!response?.errors) {
          setModalOpen(false);
          if (collaborator.userAccount.username === euaId) {
            showMessageOnNextPage(
              <SuccessRemovalMessage modelName={modelName} />
            );
            history.push('/');
          } else {
            refetch();
          }
        }
      })
      .catch(errors => {
        setModalOpen(false);
        refetch();
      });
  };

  // Modal control for removing a collaborator
  // Conditional rendering if attempting to remove yourself from model plan
  const RemoveCollaborator = () => {
    // i18n key for conditionally rendering text
    const selfOrCollaborator: string =
      removeCollaborator?.userAccount.username === euaId
        ? 'selfModal'
        : 'modal';

    return (
      <Modal
        isOpen={isModalOpen}
        closeModal={() => setModalOpen(false)}
        className="confirmation-modal"
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-1"
        >
          {collaboratorsMiscT(`${selfOrCollaborator}.heading`, {
            collaborator: removeCollaborator?.userAccount.commonName
          })}
        </PageHeading>

        <p>{collaboratorsMiscT(`${selfOrCollaborator}.subheading`)}</p>

        <Button
          type="button"
          className="margin-right-4"
          onClick={() =>
            removeCollaborator && handleRemoveCollaborator(removeCollaborator)
          }
        >
          {collaboratorsMiscT(`${selfOrCollaborator}.confirm`)}
        </Button>

        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {collaboratorsMiscT(`${selfOrCollaborator}.no`)}
        </Button>
      </Modal>
    );
  };

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <MainContent>
      {RemoveCollaborator()}

      <GridContainer>
        <Grid row gap>
          <Grid desktop={{ col: 12 }}>
            {message && <Expire delay={45000}>{message}</Expire>}

            <Breadcrumbs
              items={
                manageOrAdd === 'manage'
                  ? [
                      BreadcrumbItemOptions.HOME,
                      BreadcrumbItemOptions.COLLABORATION_AREA,
                      BreadcrumbItemOptions.TASK_LIST,
                      BreadcrumbItemOptions.COLLABORATORS
                    ]
                  : [
                      BreadcrumbItemOptions.HOME,
                      BreadcrumbItemOptions.COLLABORATORS
                    ]
              }
              customItem={
                manageOrAdd === 'manage'
                  ? null
                  : collaboratorsMiscT('collaboratorsMisc:addATeamMember')
              }
            />

            {manageOrAdd === 'manage' ? (
              <>
                <PageHeading className="margin-top-4 margin-bottom-2">
                  {collaboratorsMiscT('manageModelTeam')}
                </PageHeading>
                <p
                  className="margin-top-0 margin-bottom-2 font-body-lg"
                  data-testid="model-plan-name"
                >
                  <Trans i18nKey="draftModelPlan:for" /> {modelName}
                </p>

                <div className="font-body-lg margin-bottom-6">
                  {collaboratorsMiscT('manageModelTeamInfo')}
                </div>

                <UswdsReactLink to={`/models/${modelID}/task-list/`}>
                  <span>&larr; </span> {miscellaneousT('returnToTaskList')}
                </UswdsReactLink>
              </>
            ) : (
              <>
                <PageHeading className="margin-top-4 margin-bottom-2">
                  {collaboratorsMiscT('headingTeamMembers')}
                </PageHeading>

                <div className="font-body-lg margin-bottom-6">
                  {collaboratorsMiscT('teamMemberInfo')}
                </div>
              </>
            )}

            <h4 className="margin-bottom-1">
              {collaboratorsMiscT('teamMembers')}
            </h4>

            <UswdsReactLink
              className="usa-button margin-bottom-2"
              variant="unstyled"
              to={`/models/${modelID}/collaborators/add-collaborator?view=${manageOrAdd}`}
            >
              {collaboratorsMiscT('addTeamMemberButton')}
            </UswdsReactLink>

            {loading && <PageLoading />}
            {!loading &&
              (collaborators.length === 0 ? (
                <Alert
                  type="info"
                  heading={collaboratorsMiscT('table.noCollaborators')}
                />
              ) : (
                <CollaboratorsTable
                  collaborators={collaboratorsOrderedByModelLeads(
                    collaborators,
                    'desc'
                  )}
                  setModalOpen={setModalOpen}
                  setRemoveCollaborator={setRemoveCollaborator}
                  isLastLead={isLastLead}
                />
              ))}

            {manageOrAdd === 'add' && (
              <div className="margin-top-5 display-block">
                <UswdsReactLink
                  data-testid="button--back"
                  className="usa-button usa-button--outline"
                  variant="unstyled"
                  to="/models/new-plan"
                >
                  {miscellaneousT('back')}
                </UswdsReactLink>
                <UswdsReactLink
                  data-testid="continue-to-tasklist"
                  className="usa-button usa-button--outline"
                  variant="unstyled"
                  to={`/models/${modelID}/task-list`}
                >
                  {collaborators.length > 0
                    ? miscellaneousT('continueToTaskList')
                    : collaboratorsMiscT('continueWithoutAdding')}
                </UswdsReactLink>
              </div>
            )}
          </Grid>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

const Collaborators = () => {
  return (
    <Switch>
      <ProtectedRoute
        path="/models/:modelID/collaborators"
        exact
        render={() => <CollaboratorsContent />}
      />
      <ProtectedRoute
        path="/models/:modelID/collaborators/add-collaborator/:collaboratorId?"
        exact
        render={() => <AddCollaborator />}
      />

      {/* 404 */}
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Collaborators;
