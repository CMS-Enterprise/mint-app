import {
  ADMIN_TABS,
  AdminTab,
  CONTRACT_ASSISTANCE_TICKET_STATUS,
  ContractAssistanceTicket
} from './constants';

export type AdminTabCounts = Record<AdminTab, number>;

export const isAdminTab = (value: string | null): value is AdminTab =>
  !!value && ADMIN_TABS.includes(value as AdminTab);

export const getAdminTabFromSearchParams = (
  search: string,
  fallback: AdminTab = 'all'
): AdminTab => {
  const tab = new URLSearchParams(search).get('adminTab');

  return isAdminTab(tab) ? tab : fallback;
};

export const filterTicketsByAdminTab = (
  tickets: ContractAssistanceTicket[],
  tab: AdminTab,
  currentUserEuaId: string
): ContractAssistanceTicket[] => {
  switch (tab) {
    case 'all':
      return tickets;
    case 'open':
      return tickets.filter(
        ticket => ticket.status !== CONTRACT_ASSISTANCE_TICKET_STATUS.CLOSED
      );
    case 'unassigned':
      return tickets.filter(ticket => !ticket.assigneeId);
    case 'myTickets':
      return tickets.filter(ticket => ticket.assigneeId === currentUserEuaId);
    case 'closed':
      return tickets.filter(
        ticket => ticket.status === CONTRACT_ASSISTANCE_TICKET_STATUS.CLOSED
      );
    default:
      return tickets;
  }
};

export const getAdminTabCounts = (
  tickets: ContractAssistanceTicket[],
  currentUserEuaId: string
): AdminTabCounts =>
  ADMIN_TABS.reduce((tabCounts, tab) => {
    return {
      ...tabCounts,
      [tab]: filterTicketsByAdminTab(tickets, tab, currentUserEuaId).length
    };
  }, {} as AdminTabCounts);
