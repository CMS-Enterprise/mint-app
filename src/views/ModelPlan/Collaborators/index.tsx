import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import Spinner from 'components/Spinner';
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

const Collaborators = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');
  const [isModalOpen, setModalOpen] = useState(false);
  const [
    removeCollaborator,
    setRemoveCollaborator
  ] = useState<GetCollaboratorsType>({});

  const [mutate] = useMutation<DeleteModelPlanCollaboratorType>(
    DeleteModelPlanCollaborator
  );

  const { loading, error, data, refetch } = useQuery<GetModelCollaborators>(
    GetModelPlanCollaborators,
    {
      variables: {
        id: modelId
      }
    }
  );

  const collaborators = (data?.modelPlan?.collaborators ??
    []) as GetCollaboratorsType[];

  if (loading) {
    return (
      <div className="text-center" data-testid="table-loading">
        <Spinner size="xl" />
      </div>
    );
  }

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
          console.log(response);
          setModalOpen(false);
          refetch();
        }
      })
      .catch(errors => {
        console.log(errors);
        setModalOpen(false);
        refetch();
      });
  };

  const RemoveCollaborator = () => {
    return (
      <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
        <PageHeading headingLevel="h2" className="margin-top-0">
          {t('modal.heading')} {removeCollaborator.fullName}?
        </PageHeading>
        <p>{t('modal.subheading')}</p>
        <Button
          type="button"
          className="margin-right-4"
          onClick={() => handleRemoveCollaborator(removeCollaborator)}
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
    <MainContent className="margin-bottom-5">
      {RemoveCollaborator()}
      <div className="grid-container">
        <div className="tablet:grid-col-12">
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
            to={`/models/new-plan/${modelId}/add-collaborator`}
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
            />
          )}

          <div className="margin-top-5 display-block">
            <UswdsReactLink
              className="usa-button usa-button--outline"
              variant="unstyled"
              to={`/models/${modelId}/task-list`}
            >
              {collaborators.length > 0
                ? h('continueToTaskList')
                : t('continueWithoutAdding')}
            </UswdsReactLink>
          </div>
        </div>
      </div>
    </MainContent>
  );
};

export default Collaborators;
