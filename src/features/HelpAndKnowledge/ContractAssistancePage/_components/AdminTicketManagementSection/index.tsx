import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Icon } from '@trussworks/react-uswds';

import {
  ADMIN_TABS,
  AdminTab,
  ContractAssistanceTicket
} from '../../constants';
import ContractAssistanceTicketsTable from '../ContractAssistanceTicketsTable';

type AdminTicketManagementSectionProps = {
  tickets: ContractAssistanceTicket[];
  activeTab?: AdminTab;
};

const AdminTicketManagementSection = ({
  tickets,
  activeTab = 'all'
}: AdminTicketManagementSectionProps) => {
  const { t } = useTranslation('helpAndKnowledge');

  return (
    <div className="admin-section bg-primary-lighter radius-md padding-3 margin-bottom-5">
      <div className="display-flex flex-justify flex-align-center">
        <h2 className="margin-x-0 margin-top-0 margin-bottom-3">
          {t('contractAssistance.adminActions.title')}
        </h2>
        <Icon.LocalPolice size={4} className="text-primary-light" />
      </div>
      <ButtonGroup type="segmented" className="margin-bottom-2">
        {ADMIN_TABS.map(tab => (
          <Button key={tab} type="button" outline={tab !== activeTab}>
            {t(`contractAssistance.adminActions.tabs.${tab}`, { count: 0 })}
          </Button>
        ))}
      </ButtonGroup>
      <ContractAssistanceTicketsTable tickets={tickets} variant="admin" />
    </div>
  );
};

export default AdminTicketManagementSection;
