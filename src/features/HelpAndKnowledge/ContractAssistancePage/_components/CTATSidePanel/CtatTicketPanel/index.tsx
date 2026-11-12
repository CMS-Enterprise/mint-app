import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import NotFound from 'features/NotFound';
import {
  useGetCtatRequestAdminQuery,
  useGetCtatRequestQuery
} from 'gql/generated/graphql';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Sidepanel from 'components/Sidepanel';

import CtatDiscussionContent from '../CtatDiscussionContent';
import CtatTicketDetails from '../CtatTicketDetails';

type CtatTicketPanelProps = {
  ticketId: string;
  closeModal: () => void;
  isAdmin?: boolean;
  isDiscussionView: boolean;
};

const CtatTicketPanel = ({
  ticketId,
  closeModal,
  isAdmin = false,
  isDiscussionView
}: CtatTicketPanelProps) => {
  const { t: contractAssistanceMiscT } = useTranslation(
    'contractAssistanceMisc'
  );
  const navigate = useNavigate();
  const location = useLocation();

  const submitted = useRef<boolean>(false);

  const [disabledSubmitBtn, setDisableSubmitBtn] = useState(true);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [leavePage, setLeavePage] = useState<boolean>(false);
  const [discussionNavigationPending, setDiscussionNavigationPending] =
    useState(false);

  const requesterResult = useGetCtatRequestQuery({
    variables: { id: ticketId },
    skip: !ticketId || isAdmin
  });
  const adminResult = useGetCtatRequestAdminQuery({
    variables: { id: ticketId },
    skip: !ticketId || !isAdmin
  });

  const { loading, error } = isAdmin ? adminResult : requesterResult;

  // requester ticket will be populated when a non-admin (such as the requester) is viewing the ticket
  const requesterTicket = requesterResult.data?.ctatRequest;
  // adminTicket will be populated when an admin (even if it's the requester) is viewing the ticket
  const adminTicket = adminResult.data?.ctatRequest;
  const ticket = isAdmin ? adminTicket : requesterTicket;

  const closePanel = useCallback(() => {
    if (isDiscussionView) {
      navigate(
        `/help-and-knowledge/contract-assistance/${ticketId}${location.search}`,
        { replace: true }
      );
    } else if (isAdmin && isDirty && !submitted.current) {
      setDiscussionNavigationPending(false);
      setLeavePage(true);
    } else {
      closeModal();
    }
  }, [
    closeModal,
    isAdmin,
    isDirty,
    isDiscussionView,
    location.search,
    navigate,
    ticketId
  ]);

  const handleDiscussionClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isDirty && !submitted.current) {
        event.preventDefault();
        setDiscussionNavigationPending(true);
        setLeavePage(true);
      }
    },
    [isDirty]
  );

  const cancelLeave = useCallback(() => {
    setLeavePage(false);
    setDiscussionNavigationPending(false);
  }, []);

  const handleSubmitted = useCallback(() => {
    submitted.current = true;
    setIsDirty(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    submitted.current = false;
    setIsDirty(false);
    closeModal();
  }, [closeModal]);

  const footer =
    isAdmin && !isDiscussionView ? (
      <div className="border-top-1px border-base-lighter padding-y-4 panel-footer">
        <Button
          form="ctat-admin-form"
          type="submit"
          disabled={disabledSubmitBtn}
          className="margin-right-3 margin-top-0"
        >
          {contractAssistanceMiscT('ctatAdminPanel.saveChanges')}
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
    ) : undefined;

  return (
    <>
      <Sidepanel
        isOpen={!!ticketId}
        closeModal={closePanel}
        ariaLabel={contractAssistanceMiscT(
          isDiscussionView
            ? 'ctatViewPanel.discussionHeading'
            : 'ctatSidePanel.modalHeading'
        )}
        testid={
          isDiscussionView
            ? 'ctat-discussion-sidepanel'
            : 'ctat-ticket-view-sidepanel'
        }
        modalHeading={contractAssistanceMiscT(
          isDiscussionView
            ? 'ctatDiscussionPanel.backToTicketDetails'
            : 'ctatSidePanel.modalHeading'
        )}
        backButton={isDiscussionView}
        footer={footer}
        fixed
        contentScrollKey={
          loading
            ? undefined
            : `${ticketId}:${isDiscussionView ? 'discussion' : 'ticket'}`
        }
      >
        {loading && <PageLoading />}
        {error && <NotFound errorMessage={error.message} />}
        {!loading && !error && isDiscussionView && ticket && (
          <CtatDiscussionContent ticketNumber={ticket.humanReadableID} />
        )}
        {!loading && !error && !isDiscussionView && isAdmin && adminTicket && (
          <CtatTicketDetails
            ticket={adminTicket}
            adminTicket={adminTicket}
            isAdmin
            closeModal={handleCloseModal}
            setDisableButton={setDisableSubmitBtn}
            setIsDirty={setIsDirty}
            onSubmitted={handleSubmitted}
            onDiscussionClick={handleDiscussionClick}
          />
        )}
        {!loading &&
          !error &&
          !isDiscussionView &&
          !isAdmin &&
          requesterTicket && <CtatTicketDetails ticket={requesterTicket} />}
      </Sidepanel>

      {isAdmin && (
        <Modal
          isOpen={leavePage && !submitted.current}
          closeModal={cancelLeave}
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
            {contractAssistanceMiscT('ctatAdminPanel.leaveConfirm.description')}
          </p>

          <Button
            type="button"
            className="margin-right-4 bg-error"
            onClick={() => {
              setIsDirty(false);
              setLeavePage(false);
              if (discussionNavigationPending) {
                navigate(
                  `/help-and-knowledge/contract-assistance/${ticketId}/discussion${location.search}`
                );
              } else {
                handleCloseModal();
              }
            }}
          >
            {contractAssistanceMiscT('ctatSidePanel.leaveConfirm.confirm')}
          </Button>

          <Button type="button" unstyled onClick={cancelLeave}>
            {contractAssistanceMiscT('ctatSidePanel.leaveConfirm.dontLeave')}
          </Button>
        </Modal>
      )}
    </>
  );
};

export default CtatTicketPanel;
