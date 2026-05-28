import {
  CtatHelpNeededType,
  GetCtatRequestsRequesterQuery
} from 'gql/generated/graphql';

import { helpNeededTypes, statuses } from 'i18n/en-US/ctatRequest';
import { formatDateLocal } from 'utils/date';

import {
  ADMIN_TABS,
  AdminTab,
  CONTRACT_ASSISTANCE_TICKET_STATUS,
  ContractAssistanceTicket
} from './constants';

export type CtatRequestForTicketTable =
  GetCtatRequestsRequesterQuery['ctatRequestsRequester']['ctatRequests'][number];

const formatHelpTypes = (
  types: CtatHelpNeededType[],
  other?: string | null
): string =>
  types
    .map(type =>
      type === CtatHelpNeededType.OTHER && other ? other : helpNeededTypes[type]
    )
    .join(', ');

const formatAssigneeName = (
  userAccount: CtatRequestForTicketTable['assignedAdminUserAccount']
): string | null => {
  if (!userAccount) {
    return null;
  }

  const name = [userAccount.givenName, userAccount.familyName]
    .filter(Boolean)
    .join(' ');

  return name || null;
};

export const mapCtatRequestToContractAssistanceTicket = (
  request: CtatRequestForTicketTable
): ContractAssistanceTicket => ({
  id: request.id,
  ticketId: request.humanReadableID,
  submissionDate: formatDateLocal(request.createdDts, 'MM/dd/yyyy'),
  contractName: request.contractName?.trim() ?? '',
  helpType: formatHelpTypes(
    request.typeOfHelpNeeded,
    request.typeOfHelpNeededOther
  ),
  status: request.status ? statuses[request.status] : '',
  assigneeId: request.assignedAdminUserAccount?.username ?? null,
  assigneeName: formatAssigneeName(request.assignedAdminUserAccount)
});

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

export const mapCtatRequestsToContractAssistanceTickets = (
  requests: CtatRequestForTicketTable[]
): ContractAssistanceTicket[] =>
  requests.map(mapCtatRequestToContractAssistanceTicket);

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
