import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Link, Route, Switch, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import Expire from 'components/shared/Expire';
import useMessage from 'hooks/useMessage';
import DeleteModelPlanCollaborator from 'queries/Collaborators/DeleteModelPlanCollaborator';
import GetModelPlanCollaborators from 'queries/Collaborators/GetModelCollaborators';
import {
  DeleteModelPlanCollaborator as DeleteModelPlanCollaboratorType,
  DeleteModelPlanCollaborator_deletePlanCollaborator as ModelPlanCollaboratorType
} from 'queries/Collaborators/types/DeleteModelPlanCollaborator';
import {
  GetModelCollaborators,
  GetModelCollaborators_modelPlan_collaborators as GetCollaboratorsType
} from 'queries/Collaborators/types/GetModelCollaborators';
import NotFound from 'views/NotFound';

import AddCollaborator from './AddCollaborator';
import CollaboratorsTable from './table';

// Checking if there is only one collaborator with role of MODEL_LEAD - can't edit or remove if so
const isLastModelLead = (collaborators: GetCollaboratorsType[]) => {
  const modelLeads = collaborators.filter(
    collaborator => collaborator.teamRole === 'MODEL_LEAD'
  );
  return !(modelLeads.length > 1);
};

const SuccessRemovalMessage = ({
  modelName
}: {
  modelName: string | undefined;
}) => {
  const { t } = useTranslation('newModel');
  return (
    <Alert
      type="success"
      data-testid="mandatory-fields-alert"
      className="margin-y-4"
      heading={t('success.heading', {
        modelName
      })}
    >
      <span className="mandatory-fields-alert__text">
        {t('success.message')}
      </span>
    </Alert>
  );
};

export const CollaboratorsContent = () => {
  const { modelID } = useParams<{ modelID: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');

  const history = useHistory();

  const { message, showMessageOnNextPage } = useMessage();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLastLead, setIsLastLead] = useState(false);

  const [
    removeCollaborator,
    setRemoveCollaborator
  ] = useState<ModelPlanCollaboratorType>();

  // Current user's EUA id - to warn about removing yourself from model plan
  const { euaId } = useSelector((state: RootStateOrAny) => state.auth);

  const [mutate] = useMutation<DeleteModelPlanCollaboratorType>(
    DeleteModelPlanCollaborator
  );

  const { error, data, refetch, loading } = useQuery<GetModelCollaborators>(
    GetModelPlanCollaborators,
    {
      variables: {
        id: modelID
      }
    }
  );

  const collaborators = useMemo(() => {
    return (data?.modelPlan?.collaborators ?? []) as GetCollaboratorsType[];
  }, [data?.modelPlan?.collaborators]);

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
              <SuccessRemovalMessage modelName={data?.modelPlan?.modelName} />
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
          {t(`${selfOrCollaborator}.heading`, {
            collaborator: removeCollaborator?.userAccount.commonName
          })}
        </PageHeading>
        <p>{t(`${selfOrCollaborator}.subheading`)}</p>
        <Button
          type="button"
          className="margin-right-4"
          onClick={() =>
            removeCollaborator && handleRemoveCollaborator(removeCollaborator)
          }
        >
          {t(`${selfOrCollaborator}.confirm`)}
        </Button>
        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {t(`${selfOrCollaborator}.no`)}
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

            <BreadcrumbBar variant="wrap">
              <Breadcrumb>
                <BreadcrumbLink asCustom={Link} to="/">
                  <span>{h('home')}</span>
                </BreadcrumbLink>
              </Breadcrumb>
              <Breadcrumb current>{t('teamBreadcrumb')}</Breadcrumb>
            </BreadcrumbBar>
            <PageHeading className="margin-top-4 margin-bottom-2">
              {t('headingTeamMembers')}
            </PageHeading>
            <div className="font-body-lg margin-bottom-6">
              {t('teamMemberInfo')}
            </div>
            <h4 className="margin-bottom-1">{t('teamMembers')}</h4>
            <UswdsReactLink
              className="usa-button margin-bottom-2"
              variant="unstyled"
              to={`/models/${modelID}/collaborators/add-collaborator`}
            >
              {t('addTeamMemberButton')}
            </UswdsReactLink>

            {loading && <PageLoading />}
            {!loading &&
              (collaborators.length === 0 ? (
                <Alert type="info" heading={t('table.noCollaborators')} />
              ) : (
                <CollaboratorsTable
                  collaborators={collaborators}
                  setModalOpen={setModalOpen}
                  setRemoveCollaborator={setRemoveCollaborator}
                  isLastLead={isLastLead}
                />
              ))}

            <div className="margin-top-5 display-block">
              <UswdsReactLink
                data-testid="continue-to-tasklist"
                className="usa-button usa-button--outline"
                variant="unstyled"
                to={`/models/${modelID}/task-list`}
              >
                {collaborators.length > 0
                  ? h('continueToTaskList')
                  : t('continueWithoutAdding')}
              </UswdsReactLink>
            </div>
          </Grid>
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

const Collaborators = () => {
  return (
    <Switch>
      <Route
        path="/models/:modelID/collaborators"
        exact
        render={() => <CollaboratorsContent />}
      />
      <Route
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
