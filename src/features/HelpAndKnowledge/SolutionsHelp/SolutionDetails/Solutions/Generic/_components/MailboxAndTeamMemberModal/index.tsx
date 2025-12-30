import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import { SolutionContactType } from 'features/HelpAndKnowledge/SolutionsHelp/solutionsMap';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { mtoCommonSolutionContactMisc } from 'i18n/en-US/modelPlan/mtoCommonSolutionContact';

import TeamMailboxForm from '../TeamMailboxForm';
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
  const { t: contactMiscT } = useTranslation('mtoCommonSolutionContactMisc');

  const [disabledSubmitBtn, setDisableSubmitBtn] = useState(true);

  const isTeamMemberMode =
    mode === 'addTeamMember' || mode === 'editTeamMember';

  const isTeamMailboxMode =
    mode === 'addTeamMailbox' || mode === 'editTeamMailbox';

  return (
    <Modal
      isOpen={isOpen}
      closeModal={closeModal}
      fixed
      className="tablet:width-mobile-lg mint-body-normal"
      testId="mailbox-and-team-member-modal"
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

      {isTeamMailboxMode && (
        <TeamMailboxForm
          mode={mode}
          closeModal={closeModal}
          teamMailbox={contact}
          setDisableButton={setDisableSubmitBtn}
        />
      )}

      {isTeamMemberMode && (
        <TeamMemberForm
          mode={mode}
          closeModal={closeModal}
          teamMember={contact}
          setDisableButton={setDisableSubmitBtn}
        />
      )}

      <div className="margin-top-2 display-flex mint-modal__footer">
        <Button
          form={isTeamMemberMode ? 'team-member-form' : 'team-mailbox-form'}
          type="submit"
          disabled={disabledSubmitBtn}
          className="margin-right-3 margin-top-0"
        >
          {contactMiscT(`${mode}.cta`)}
        </Button>
        <Button
          type="button"
          className="margin-top-0"
          unstyled
          onClick={closeModal}
        >
          {contactMiscT('cancel')}
        </Button>
      </div>
    </Modal>
  );
};

export default MailboxAndTeamMemberModal;
