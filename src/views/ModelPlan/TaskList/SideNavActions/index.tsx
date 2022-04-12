import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';

// import { isIntakeOpen } from 'utils/systemIntake';
// type SideNavActionsProps = {
//   intake: SystemIntake;
//   archiveIntake: () => void;
// };

// const SideNavActions = ({ intake, archiveIntake }: SideNavActionsProps) => {
const SideNavActions = () => {
  const { t } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div
      className="sidenav-actions grid-row flex-column border-top-05 border-primary-lighter"
      data-testid="sidenav-actions"
    >
      <div className="grid-col margin-top-105">
        <UswdsReactLink to="/">Save & Exit</UswdsReactLink>
      </div>
      {true && (
        <div className="grid-col margin-top-2">
          <Button
            className="line-height-body-5 test-withdraw-request"
            type="button"
            unstyled
            onClick={() => setModalOpen(true)}
          >
            Remove your request to add a new system
          </Button>
          <Modal isOpen={isModalOpen} closeModal={() => setModalOpen(false)}>
            <PageHeading headingLevel="h2" className="margin-top-0">
              request name
            </PageHeading>
            <p>{t('taskList:withdraw_modal:warning')}</p>
            <Button
              type="button"
              className="margin-right-4"
              onClick={() => console.log('arhcived')}
            >
              {/* {t('taskList:withdraw_modal:confirm')} */}
              confirm
            </Button>
            <Button type="button" unstyled onClick={() => setModalOpen(false)}>
              {/* {t('taskList:withdraw_modal:cancel')} */}
              cancel
            </Button>
          </Modal>
        </div>
      )}
      <div className="grid-col margin-top-5">
        <h4>Related Content</h4>
        <UswdsReactLink
          aria-label="Open overview for adding a system in a new tab"
          className="line-height-body-5"
          to="/governance-overview"
          variant="external"
          target="_blank"
        >
          Overview for adding a system
          <span aria-hidden>&nbsp;(opens in a new tab)</span>
        </UswdsReactLink>
      </div>
    </div>
  );
};

export default SideNavActions;
