import React from 'react';
import { useTranslation } from 'react-i18next';
import NotFound from 'features/NotFound';
import { useGetCtatRequestQuery } from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';
import Sidepanel from 'components/Sidepanel';

import CtatTicketViewContent from './CtatTicketViewContent';

type CtatTicketViewPanelProps = {
  ticketId: string;
  closeModal: () => void;
};

const CtatTicketViewPanel = ({
  ticketId,
  closeModal
}: CtatTicketViewPanelProps) => {
  const { t } = useTranslation('contractAssistance');

  const { data, loading, error } = useGetCtatRequestQuery({
    variables: { id: ticketId },
    skip: !ticketId
  });

  const ticket = data?.ctatRequest;

  return (
    <Sidepanel
      isOpen={!!ticketId}
      closeModal={closeModal}
      ariaLabel={t('ctatSidePanel.modalHeading')}
      testid="ctat-ticket-view-sidepanel"
      modalHeading={t('ctatSidePanel.modalHeading')}
      fixed
    >
      {loading && <PageLoading />}
      {error && <NotFound errorMessage={error.message} />}
      {!loading && !error && ticket && (
        <CtatTicketViewContent ticket={ticket} />
      )}
    </Sidepanel>
  );
};

export default CtatTicketViewPanel;
