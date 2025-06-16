import React from 'react';
import { Trans } from 'react-i18next';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { mtoCommonSolutionContactMisc } from 'i18n/en-US/modelPlan/mtoCommonSolutionContact';

import AddMailboxAndTeamMemberForm from '../AddMailboxAndTeamMemberForm';

// Matching keys in helpAndKnowledge
export type ModeType = 'addTeamMailbox' | 'addTeamMember';

const MailboxAndTeamMemberModal = ({
  isOpen,
  closeModal,
  mode
}: {
  isOpen: boolean;
  closeModal: () => void;
  mode: ModeType;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal overflow-auto"
    >
      <div className="margin-bottom-2">
        <PageHeading headingLevel="h3" className="margin-y-0">
          {mtoCommonSolutionContactMisc[mode].title}
        </PageHeading>
        <p className="text-base margin-y-1">
          <Trans
            i18nKey={mtoCommonSolutionContactMisc.allFieldsRequired}
            components={{
              s: <span className="text-error" />
            }}
          />
        </p>
      </div>

      <AddMailboxAndTeamMemberForm mode={mode} closeModal={closeModal} />
    </Modal>
  );
};

export default MailboxAndTeamMemberModal;
