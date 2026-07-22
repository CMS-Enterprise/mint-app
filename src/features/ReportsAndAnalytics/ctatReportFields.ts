import { CTATReportData } from 'hooks/useFetchCTATReport';
import {
  cmmiDivisions,
  cmmiGroups,
  contractActivityTypes,
  contractTypes,
  helpNeededTypeDisplayOverrides,
  helpNeededTypes,
  requestUrgencies,
  statuses
} from 'i18n/en-US/ctatRequest';
import { formatDateUtc } from 'utils/date';

type CTATCSVField = {
  label: string;
  value: (row: CTATReportData) => string | number;
};

const formatCTATDate = (date?: string | null) =>
  date ? formatDateUtc(date, 'MM/dd/yyyy') : '';

const csvFieldsCTAT: CTATCSVField[] = [
  {
    label: 'Requester name and email',
    value: row =>
      `${row.requesterUserAccount.commonName} (${row.requesterUserAccount.email})`
  },
  {
    label: 'Date submitted',
    value: row => formatCTATDate(row.createdDts)
  },
  {
    label: 'CMMI group',
    value: row => (row.cmmiGroup ? cmmiGroups[row.cmmiGroup] : '')
  },
  {
    label: 'Other CMMI group',
    value: row => row.cmmiGroupOther ?? ''
  },
  {
    label: 'CMMI division',
    value: row => (row.cmmiDivision ? cmmiDivisions[row.cmmiDivision] : '')
  },
  {
    label: 'Other CMMI division',
    value: row => row.cmmiDivisionOther ?? ''
  },
  {
    label: 'Model(s) or demonstration(s)',
    value: row =>
      (row.relatedMINTModels ?? []).map(model => model.modelName).join(', ')
  },
  {
    label: 'Contract activity type',
    value: row =>
      row.contractActivityType
        ? contractActivityTypes[row.contractActivityType]
        : ''
  },
  {
    label: 'Other contract activity type',
    value: row => row.contractActivityTypeOther ?? ''
  },
  {
    label: 'Contract name',
    value: row => row.contractName ?? ''
  },
  {
    label: 'Contract number',
    value: row => row.contractNumber ?? ''
  },
  {
    label: 'Contract type',
    value: row => (row.contractType ? contractTypes[row.contractType] : '')
  },
  {
    label: 'Other contract type',
    value: row => row.contractTypeOther ?? ''
  },
  {
    label: 'Type of help needed',
    value: row =>
      row.typeOfHelpNeeded
        .map(
          helpType =>
            helpNeededTypeDisplayOverrides[helpType] ??
            helpNeededTypes[helpType]
        )
        .join(', ')
  },
  {
    label: 'Other help type',
    value: row => row.typeOfHelpNeededOther ?? ''
  },
  {
    label: 'Describe the type of assistance you need',
    value: row => row.describeHelpNeeded ?? ''
  },
  {
    label: 'Request urgency',
    value: row =>
      row.requestUrgency ? requestUrgencies[row.requestUrgency] : ''
  },
  {
    label: 'Need by date',
    value: row => formatCTATDate(row.dateAssistanceNeededBy)
  },
  {
    label: 'Supporting documents',
    value: row => row.supportingDocuments.map(doc => doc.fileName).join(', ')
  },
  {
    label: 'Status',
    value: row => (row.status ? statuses[row.status] : '')
  },
  {
    label: 'Assigned admin team member',
    value: row => row.assignedAdminUserAccount?.commonName ?? ''
  },
  {
    label: 'Date assigned',
    value: row => formatCTATDate(row.adminAssignedDts)
  },
  {
    label: 'Progress notes',
    value: row => row.notes ?? ''
  },
  {
    label: 'Resolution',
    value: row => row.resolution ?? ''
  },
  {
    label: 'Date closed',
    value: row => formatCTATDate(row.completedDts)
  },
  {
    label: 'Days from submission to close',
    value: row => row.daysFromSubmittedToCompleted ?? ''
  }
];

export default csvFieldsCTAT;
