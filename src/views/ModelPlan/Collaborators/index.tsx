import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
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
import Alert from 'components/shared/Alert';
import DeleteModelPlanCollaborator from 'queries/DeleteModelPlanCollaborator';
import GetModelPlanCollaborators from 'queries/GetModelCollaborators';
import {
  DeleteModelPlanCollaborator as DeleteModelPlanCollaboratorType,
  DeleteModelPlanCollaborator_deletePlanCollaborator as ModelPlanCollaboratorType
} from 'queries/types/DeleteModelPlanCollaborator';
import {
  GetModelCollaborators,
  GetModelCollaborators_modelPlan_collaborators as GetCollaboratorsType
} from 'queries/types/GetModelCollaborators';

import CollaboratorsTable from './table';

// Checking if there is only one collaborator with role of MODEL_LEAD - can't edit or remove if so
const isLastModelLead = (collaborators: GetCollaboratorsType[]) => {
  const modelLeads = collaborators.filter(
    collaborator => collaborator.teamRole === 'MODEL_LEAD'
  );
  return !(modelLeads.length > 1);
};

const Collaborators = () => {
  const { modelID } = useParams<{ modelID: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLastLead, setIsLastLead] = useState(false);
  const [
    removeCollaborator,
    setRemoveCollaborator
  ] = useState<ModelPlanCollaboratorType>();

  const [mutate] = useMutation<DeleteModelPlanCollaboratorType>(
    DeleteModelPlanCollaborator
  );

  const { error, data, refetch } = useQuery<GetModelCollaborators>(
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
        input: collaborator
      }
    })
      .then(response => {
        if (!response?.errors) {
          setModalOpen(false);
          refetch();
        }
      })
      .catch(errors => {
        setModalOpen(false);
        refetch();
      });
  };

  // Modal control for removing a collaborator
  const RemoveCollaborator = () => {
    return (
      <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
        <PageHeading headingLevel="h2" className="margin-top-0">
          {t('modal.heading')} {removeCollaborator?.fullName}?
        </PageHeading>
        <p>{t('modal.subheading')}</p>
        <Button
          type="button"
          className="margin-right-4"
          onClick={() =>
            removeCollaborator && handleRemoveCollaborator(removeCollaborator)
          }
        >
          {t('modal.confirm')}
        </Button>
        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {t('modal.no')}
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
            <BreadcrumbBar variant="wrap">
              <Breadcrumb>
                <BreadcrumbLink asCustom={Link} to="/">
                  <span>{h('home')}</span>
                </BreadcrumbLink>
              </Breadcrumb>
              <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
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
              to={`/models/new-plan/${modelID}/add-collaborator`}
            >
              {t('addTeamMemberButton')}
            </UswdsReactLink>

            {collaborators.length === 0 ? (
              <Alert type="info" heading={t('table.noCollaborators')} />
            ) : (
              <CollaboratorsTable
                collaborators={collaborators}
                setModalOpen={setModalOpen}
                setRemoveCollaborator={setRemoveCollaborator}
                isLastLead={isLastLead}
              />
            )}

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

export default Collaborators;
