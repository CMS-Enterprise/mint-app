import React from 'react';
import { Trans } from 'react-i18next';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { mtoCommonSolutionContactMisc } from 'i18n/en-US/modelPlan/mtoCommonSolutionContact';

import AddTeamMailboxForm from '../AddTeamMailboxForm';
import EditTeamMailboxForm from '../EditTeamMailboxForm';
import TeamMemberForm from '../TeamMemberForm';

export type ModeType = TeamMemberModeType | TeamMailboxModeType;
// Matching keys in mtoCommonSolutionContactMisc
export type TeamMemberModeType = 'addTeamMember' | 'editTeamMember';
export type TeamMailboxModeType = 'addTeamMailbox' | 'editTeamMailbox';

const MailboxAndTeamMemberModal = ({
  isOpen,
  closeModal,
  mode,
  contact
}: {
  isOpen: boolean;
  closeModal: () => void;
  mode: ModeType;
  contact?: SolutionContactType;
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

      {mode === 'addTeamMailbox' && (
        <AddTeamMailboxForm closeModal={closeModal} />
      )}
      {mode === 'editTeamMailbox' && contact && (
        <EditTeamMailboxForm closeModal={closeModal} teamMailbox={contact} />
      )}

      {(mode === 'addTeamMember' || mode === 'editTeamMember') && (
        <TeamMemberForm
          mode={mode}
          closeModal={closeModal}
          teamMember={contact}
        />
      )}
    </Modal>
  );
};

export default MailboxAndTeamMemberModal;
