import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

import TeamMembersList from './TeamMembersList';

// import { isIntakeOpen } from 'utils/systemIntake';
// type SideNavActionsProps = {
//   intake: SystemIntake;
//   archiveIntake: () => void;
// };

// const SideNavActions = ({ intake, archiveIntake }: SideNavActionsProps) => {
const TaskListSideNav = () => {
  const { t } = useTranslation('modelPlanTaskList');
  const [isModalOpen, setModalOpen] = useState(false);

  const renderModal = () => {
    return (
      <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
        <PageHeading headingLevel="h2" className="margin-top-0">
          {t('withdraw_modal.header', {
            // requestName: intake.requestName
            requestName: 'Requestor Name'
          })}
        </PageHeading>
        <p>{t('withdraw_modal.warning')}</p>
        <Button
          type="button"
          className="margin-right-4"
          onClick={() => console.log('arhcived')}
        >
          {t('withdraw_modal.confirm')}
        </Button>
        <Button type="button" unstyled onClick={() => setModalOpen(false)}>
          {t('withdraw_modal.cancel')}
        </Button>
      </Modal>
    );
  };

  // TODO: TODO: Integrate with BE via gql, but it is not ready yet.
  // Until then, using this sample team member array.
  const sampleTeamMembers = [
    'Jane McModelteam',
    'Laura Rodriguez',
    'Allison Li',
    'Bryce Greenfield-Jones'
  ];

  return (
    <>
      {renderModal()}
      <div
        className="sidenav-actions margin-left-4 border-top-05 border-primary-lighter padding-top-2"
        data-testid="sidenav-actions"
      >
        <div className="margin-bottom-1">
          <UswdsReactLink to="/">{t('sideNav.saveAndExit')}</UswdsReactLink>
        </div>
        <Button
          className="line-height-body-5 test-withdraw-request"
          type="button"
          unstyled
          onClick={() => setModalOpen(true)}
        >
          {t('sideNav.remove')}
        </Button>
        <div className="margin-top-4 margin-bottom-7">
          <h4 className="margin-bottom-1">{t('sideNav.relatedContent')}</h4>
          <UswdsReactLink
            aria-label={t('sideNav.ariaLabelForOverview')}
            className="line-height-body-5"
            to="/"
            variant="external"
            target="_blank"
          >
            <Trans i18nKey="modelPlanTaskList:sideNav.overview">
              indexZero
              <span aria-hidden /> indexTwo
            </Trans>
          </UswdsReactLink>
        </div>
        <div>
          <h3 className="margin-bottom-05">{t('sideNav.modelTeam')}</h3>
          <div className="margin-bottom-2">
            <UswdsReactLink to="/">{t('sideNav.editTeam')}</UswdsReactLink>
          </div>
          <div className="sidenav-actions__teamList">
            <ul className="usa-list usa-list--unstyled">
              <TeamMembersList team={sampleTeamMembers} />
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskListSideNav;
