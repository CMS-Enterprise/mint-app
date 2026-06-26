export type ContractAssistanceTicket = {
  id: string;
  ticketId: string;
  submissionDate: string;
  contractName: string;
  helpType: string;
  status: string;
  assigneeId: string | null;
  assigneeName: string | null;
};

export const CONTRACT_ASSISTANCE_TICKET_STATUS = {
  OPEN: 'Open',
  CLOSED: 'Closed'
} as const;

export const TICKET_TABLE_COLUMNS = [
  'ticketId',
  'submissionDate',
  'contractName',
  'helpType',
  'status'
] as const satisfies readonly (keyof ContractAssistanceTicket)[];

export const ADMIN_TABS = [
  'all',
  'open',
  'unassigned',
  'myTickets',
  'closed'
] as const;

export type AdminTab = (typeof ADMIN_TABS)[number];
