import { TFunction } from 'i18next';

type CTATCSVField = {
  label: string;
  value: string;
};

export const utcDateFieldsToFormat: string[] = [
  'createdDts',
  'dateAssistanceNeededBy',
  'adminAssignedDts',
  'completedDts'
];

const csvFieldsCTAT = (t: TFunction): (CTATCSVField | string)[] => [
  {
    label: 'requester',
    value: 'requesterUserAccount'
  },
  {
    label: 'dateSubmitted',
    value: 'createdDts'
  },
  'cmmiGroup',
  'cmmiGroupOther',
  'cmmiDivision',
  'cmmiDivisionOther',
  'relatedMINTModels',
  'contractActivityType',
  'contractActivityTypeOther',
  'contractName',
  'contractNumber',
  'contractType',
  'contractTypeOther',
  'typeOfHelpNeeded',
  'typeOfHelpNeededOther',
  'describeHelpNeeded',
  'requestUrgency',
  'dateAssistanceNeededBy',
  'supportingDocuments',
  'status',
  {
    label: 'assignedAdmin',
    value: 'assignedAdminUserAccount.commonName'
  },
  {
    label: 'dateAssigned',
    value: 'adminAssignedDts'
  },
  'notes',
  'resolution',
  {
    label: 'dateClosed',
    value: 'completedDts'
  },
  'daysFromSubmittedToCompleted'
];

export default csvFieldsCTAT;
