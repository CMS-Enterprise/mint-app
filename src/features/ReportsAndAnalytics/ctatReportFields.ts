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
    label: t<string, {}, string>(
      'contractAssistanceMisc:reportHeaders.dateSubmitted'
    ),
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
    label: t<string, {}, string>(
      'contractAssistanceMisc:reportHeaders.dateAssigned'
    ),
    value: 'adminAssignedDts'
  },
  'notes',
  'resolution',
  {
    label: t<string, {}, string>(
      'contractAssistanceMisc:reportHeaders.dateClosed'
    ),
    value: 'completedDts'
  },
  {
    label: t<string, {}, string>(
      'contractAssistanceMisc:reportHeaders.daysFromSubmittedToCompleted'
    ),
    value: 'daysFromSubmittedToCompleted'
  }
];

export default csvFieldsCTAT;
