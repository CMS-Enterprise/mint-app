import { CtatStatus } from 'gql/generated/graphql';

export type ContractAssistanceTicket = {
  id: string;
  ticketId: string;
  submissionDate: string;
  contractName: string;
  cmmiGroupAcronym: string;
  helpType: string;
  statusCode: CtatStatus | null;
  assigneeId: string | null;
  assigneeName: string | null;
};

export const TICKET_TABLE_COLUMNS = [
  'ticketId',
  'submissionDate',
  'contractName',
  'cmmiGroupAcronym',
  'helpType',
  'statusCode'
] as const satisfies readonly (keyof ContractAssistanceTicket)[];

export const ADMIN_TABS = [
  'all',
  'open',
  'unassigned',
  'myTickets',
  'closed'
] as const;

export type AdminTab = (typeof ADMIN_TABS)[number];
