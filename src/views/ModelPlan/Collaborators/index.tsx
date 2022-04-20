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

const Collaborators = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const { t: h } = useTranslation('draftModelPlan');
  const { t } = useTranslation('newModel');
  const [isModalOpen, setModalOpen] = useState(false);
  const [removeUser, setRemoveUser] = useState<CollaboratorsType>({});

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

  const RemoveCollaborator = () => {
    return (
      <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
        <PageHeading headingLevel="h2" className="margin-top-0">
          {t('modal.heading')} {removeUser.fullName}?
        </PageHeading>
        <p>{t('modal.subheading')}</p>
        <Button
          type="button"
          className="margin-right-4"
          // TODO GQL query to remove collaborator
          onClick={() => console.log('TODO remove user!')}
        >
          {t('modal.confirm')}
        </Button>
        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {t('modal.no')}
        </Button>
      </Modal>
    );
  };

  // Mocked data
  const collaborators = [
    {
      id: 'qwe',
      modelPlanID: '456',
      euaUserID: 'ABCD',
      fullName: 'John Doe',
      cmsCenter: 'CMMI',
      teamRole: 'MODEL_LEAD'
    },
    {
      id: 'asd',
      modelPlanID: '789',
      euaUserID: 'QWER',
      fullName: 'Jane Oddball',
      cmsCenter: 'CMMI',
      teamRole: 'LEADERSHIP'
    },
    {
      id: 'zxc',
      modelPlanID: '009',
      euaUserID: 'ZXCV',
      fullName: 'Patrick John',
      cmsCenter: 'CMMI',
      teamRole: 'MODEL_LEAD'
    }
  ];

  //   if (error) {
  //     return <div>{JSON.stringify(error)}</div>;
  //   }

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

          <CollaboratorsTable
            collaborators={collaborators}
            setModalOpen={setModalOpen}
            setRemoveUser={setRemoveUser}
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
