import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import { ContractAssistanceTicket } from '../../constants';
import ContractAssistanceTicketsTable from '../ContractAssistanceTicketsTable';

type UserSubmittedTicketsSectionProps = {
  tickets: ContractAssistanceTicket[];
};

const UserSubmittedTicketsSection = ({
  tickets
}: UserSubmittedTicketsSectionProps) => {
  const { t } = useTranslation('contractAssistance');

  return (
    <div>
      <h2 className="margin-0">{t('userSubmittedTickets.title')}</h2>
      <p className="mint-body-md margin-bottom-2 margin-top-05 line-height-sans-4 text-light">
        {t('userSubmittedTickets.description')}
      </p>
      <Button type="button" className="margin-bottom-4">
        {t('userSubmittedTickets.button')}
      </Button>
      <ContractAssistanceTicketsTable tickets={tickets} variant="user" />
    </div>
  );
};

export default UserSubmittedTicketsSection;
