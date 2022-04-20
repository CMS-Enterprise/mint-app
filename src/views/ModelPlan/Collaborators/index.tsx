import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
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
import Spinner from 'components/Spinner';
import GetCollaborators from 'queries/GetCollaborators';
import {
  CollaboratorsType,
  GetGetCollaborators as GetCollaboratorsType
} from 'queries/types/GetDraftModelPlans';

import CollaboratorsTable from './table';

const RemoveCollaborator = () => {
  const { t } = useTranslation('newModel');
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
      <PageHeading headingLevel="h2" className="margin-top-0">
        {t('withdraw_modal.header', {
          // TODO: requestName?
          // requestName: intake.requestName
          requestName: 'Requestor Name'
        })}
      </PageHeading>
      <p>{t('withdraw_modal.warning')}</p>
      <Button
        type="button"
        className="margin-right-4"
        // TODO to pass down archive functional prop
        onClick={() => console.log('archive!')}
      >
        {t('withdraw_modal.confirm')}
      </Button>
      <Button type="button" unstyled onClick={() => setModalOpen(false)}>
        {t('withdraw_modal.cancel')}
      </Button>
    </Modal>
  );
};

const Collaborators = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');

  //   const { loading, error, data } = useQuery<GetCollaboratorsType>(
  //     GetCollaborators
  //   );

  //   const collaborators = (data?.modelPlanCollection ??
  //     []) as CollaboratorsType[];

  //   if (loading) {
  //     return (
  //       <div className="text-center" data-testid="table-loading">
  //         <Spinner size="xl" />
  //       </div>
  //     );
  //   }

  // Mocked data
  const collaborators = [
    {
      id: '123',
      modelPlanID: '456',
      euaUserID: 'ABCD',
      fullName: 'John Doe',
      cmsCenter: 'CMMI',
      teamRole: 'MODEL_LEAD'
    }
  ];

  //   if (error) {
  //     return <div>{JSON.stringify(error)}</div>;
  //   }

  return (
    <MainContent className="margin-bottom-5">
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
            className="usa-button"
            variant="unstyled"
            to={`/models/new-plan/${modelId}/add-collaborator`}
          >
            {t('addTeamMemberButton')}
          </UswdsReactLink>

          <CollaboratorsTable
            collaborators={collaborators}
            setModalOpen={setModalOpen}
          />

          <div className="margin-top-5 display-block">
            <UswdsReactLink
              className="usa-button usa-button--outline"
              variant="unstyled"
              to={`/models/${modelId}/task-list`}
            >
              {t('continueWithoutAdding')}
            </UswdsReactLink>
          </div>
        </div>
      </div>
    </MainContent>
  );
};

export default Collaborators;
