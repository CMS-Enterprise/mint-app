import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import Sidepanel from 'components/Sidepanel';

import CtatTicketForm from './CtatTicketForm';

const CtatSidePanel = ({
  isOpen,
  closeModal
}: {
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const { t: contractAssistanceMiscT } = useTranslation(
    'contractAssistanceMisc'
  );

  const submitted = useRef<boolean>(false);

  const [disabledSubmitBtn, setDisableSubmitBtn] = useState(true);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [leavePage, setLeavePage] = useState<boolean>(false);

  const closePanel = useCallback(() => {
    if (isDirty && !submitted.current) {
      setLeavePage(true);
    } else {
      closeModal();
    }
  }, [closeModal, isDirty]);

  const handleSubmitted = useCallback(() => {
    submitted.current = true;
    setIsDirty(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    submitted.current = false;
    setIsDirty(false);
    closeModal();
  }, [closeModal]);

  const footer = (
    <div className="border-top-1px border-base-lighter padding-y-4 panel-footer">
      <Button
        form="ctat-ticket-form"
        type="submit"
        disabled={disabledSubmitBtn}
        className="margin-right-3 margin-top-0"
      >
        {contractAssistanceMiscT('ctatSidePanel.submitTicket')}
      </Button>
      <Button
        type="button"
        className="margin-top-0"
        unstyled
        onClick={closePanel}
      >
        {contractAssistanceMiscT('ctatSidePanel.cancel')}
      </Button>
    </div>
  );

  return (
    <>
      <Sidepanel
        isOpen={isOpen}
        closeModal={closePanel}
        ariaLabel={contractAssistanceMiscT('ctatSidePanel.modalHeading')}
        testid="ctat-sidepanel"
        modalHeading={contractAssistanceMiscT('ctatSidePanel.modalHeading')}
        footer={footer}
        fixed
      >
        <CtatTicketForm
          closeModal={handleCloseModal}
          setDisableButton={setDisableSubmitBtn}
          setIsDirty={setIsDirty}
          onSubmitted={handleSubmitted}
        />
      </Sidepanel>

      <Modal
        isOpen={leavePage && !submitted.current}
        closeModal={() => setLeavePage(false)}
        className="confirmation-modal"
        zTop
      >
        <PageHeading
          headingLevel="h3"
          className="margin-top-neg-2 margin-bottom-1"
        >
          {contractAssistanceMiscT('ctatSidePanel.leaveConfirm.heading')}
        </PageHeading>

        <p className="margin-top-2 margin-bottom-3">
          {contractAssistanceMiscT('ctatSidePanel.leaveConfirm.description')}
        </p>

        <Button
          type="button"
          className="margin-right-4 bg-error"
          onClick={() => {
            setIsDirty(false);
            setLeavePage(false);
            handleCloseModal();
          }}
        >
          {contractAssistanceMiscT('ctatSidePanel.leaveConfirm.confirm')}
        </Button>

        <Button type="button" unstyled onClick={() => setLeavePage(false)}>
          {contractAssistanceMiscT('ctatSidePanel.leaveConfirm.dontLeave')}
        </Button>
      </Modal>
    </>
  );
};

export default CtatSidePanel;
