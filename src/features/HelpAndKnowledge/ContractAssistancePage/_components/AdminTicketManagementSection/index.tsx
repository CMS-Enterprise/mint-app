import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, ButtonGroup, Icon } from '@trussworks/react-uswds';
import { AppState } from 'stores/reducers/rootReducer';

import {
  ADMIN_TABS,
  AdminTab,
  ContractAssistanceTicket
} from '../../constants';
import {
  filterTicketsByAdminTab,
  getAdminTabCounts,
  getAdminTabFromSearchParams
} from '../../utils';
import ContractAssistanceTicketsTable from '../ContractAssistanceTicketsTable';

type AdminTicketManagementSectionProps = {
  tickets: ContractAssistanceTicket[];
};

const AdminTicketManagementSection = ({
  tickets
}: AdminTicketManagementSectionProps) => {
  const { t } = useTranslation('helpAndKnowledge');
  const { euaId } = useSelector((state: AppState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const activeTab = getAdminTabFromSearchParams(location.search);
  const tabCounts = useMemo(
    () => getAdminTabCounts(tickets, euaId),
    [tickets, euaId]
  );

  const filteredTickets = useMemo(
    () => filterTicketsByAdminTab(tickets, activeTab, euaId),
    [tickets, activeTab, euaId]
  );

  const getTabLabel = (tab: AdminTab) =>
    t(`contractAssistance.adminActions.tabs.${tab}`, { count: tabCounts[tab] });

  const setActiveTab = (tab: AdminTab) => {
    params.set('adminTab', tab);
    navigate({ search: params.toString() }, { replace: true });
  };

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
          <Button
            key={tab}
            type="button"
            outline={tab !== activeTab}
            onClick={() => setActiveTab(tab)}
          >
            {getTabLabel(tab)}
          </Button>
        ))}
      </ButtonGroup>

      <ContractAssistanceTicketsTable
        tickets={filteredTickets}
        variant="admin"
        adminTab={activeTab}
      />
    </div>
  );
};

export default AdminTicketManagementSection;
