import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import { useGetCtatRequestQuery } from 'gql/generated/graphql';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Sidepanel from 'components/Sidepanel';

import CtatTicketViewContent from './CtatTicketViewContent';

type CtatTicketViewPanelProps = {
  ticketId: string;
  closeModal: () => void;
  isAdmin?: boolean;
};

const CtatTicketViewPanel = ({
  ticketId,
  closeModal,
  isAdmin = false
}: CtatTicketViewPanelProps) => {
  const { t } = useTranslation('contractAssistance');

  const submitted = useRef<boolean>(false);

  const [disabledSubmitBtn, setDisableSubmitBtn] = useState(true);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [leavePage, setLeavePage] = useState<boolean>(false);

  const { data, loading, error } = useGetCtatRequestQuery({
    variables: { id: ticketId },
    skip: !ticketId
  });

  const ticket = data?.ctatRequest;

  const closePanel = useCallback(() => {
    if (isAdmin && isDirty && !submitted.current) {
      setLeavePage(true);
    } else {
      closeModal();
    }
  }, [closeModal, isAdmin, isDirty]);

  const handleSubmitted = useCallback(() => {
    submitted.current = true;
    setIsDirty(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    submitted.current = false;
    setIsDirty(false);
    closeModal();
  }, [closeModal]);

  const footer = isAdmin ? (
    <div className="border-top-1px border-base-lighter padding-y-4 panel-footer">
      <Button
        form="ctat-admin-form"
        type="submit"
        disabled={disabledSubmitBtn}
        className="margin-right-3 margin-top-0"
      >
        {t('ctatAdminPanel.saveChanges')}
      </Button>
      <Button
        type="button"
        className="margin-top-0"
        unstyled
        onClick={closePanel}
      >
        {t('ctatSidePanel.cancel')}
      </Button>
    </div>
  ) : undefined;

  return (
    <>
      <Sidepanel
        isOpen={!!ticketId}
        closeModal={closePanel}
        ariaLabel={t('ctatSidePanel.modalHeading')}
        testid="ctat-ticket-view-sidepanel"
        modalHeading={t('ctatSidePanel.modalHeading')}
        footer={footer}
        fixed
        contentScrollKey={loading ? undefined : ticketId}
      >
        {loading && <PageLoading />}
        {error && <NotFound errorMessage={error.message} />}
        {!loading && !error && ticket && (
          <CtatTicketViewContent
            ticket={ticket}
            isAdmin={isAdmin}
            closeModal={handleCloseModal}
            setDisableButton={setDisableSubmitBtn}
            setIsDirty={setIsDirty}
            onSubmitted={handleSubmitted}
          />
        )}
      </Sidepanel>

      {isAdmin && (
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
            {t('ctatSidePanel.leaveConfirm.heading')}
          </PageHeading>

          <p className="margin-top-2 margin-bottom-3">
            {t('ctatAdminPanel.leaveConfirm.description')}
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
            {t('ctatSidePanel.leaveConfirm.confirm')}
          </Button>

          <Button type="button" unstyled onClick={() => setLeavePage(false)}>
            {t('ctatSidePanel.leaveConfirm.dontLeave')}
          </Button>
        </Modal>
      )}
    </>
  );
};

export default CtatTicketViewPanel;
