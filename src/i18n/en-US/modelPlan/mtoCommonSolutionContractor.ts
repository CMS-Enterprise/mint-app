import { TranslationMTOCommonSolutionContractorCustom } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const mtoCommonSolutionContractor: TranslationMTOCommonSolutionContractorCustom =
  {
    key: {
      gqlField: 'key',
      goField: 'Key',
      dbField: 'mto_common_solution_key',
      label: 'MTO Common Solution',
      dataType: TranslationDataType.ENUM,
      formType: TranslationFormType.TEXT,
      tableReference: TableName.MTO_COMMON_SOLUTION,
      order: 1.1
    },
    contractTitle: {
      gqlField: 'contractTitle',
      goField: 'contractTitle',
      dbField: 'contract_title',
      label: 'Contract Title',
      dataType: TranslationDataType.STRING,
      formType: TranslationFormType.TEXT,
      order: 1.2
    },
    contractorName: {
      gqlField: 'contractorName',
      goField: 'ContractorName',
      dbField: 'contractor_name',
      label: 'Contractor Name',
      dataType: TranslationDataType.STRING,
      formType: TranslationFormType.TEXT,
      order: 1.3
    }
  };

export const mtoCommonSolutionContractorMisc = {
  addContractor: {
    title: 'Add a contractor',
    cta: 'Add contractor',
    success: 'You added <bold>{{-contractor}}</bold> as a contractor.',
    error:
      'There was an issue adding this contractor. Please try again, and if the problem persists, try again later.'
  },
  editContractor: {
    title: 'Edit contractor',
    cta: 'Save Changes',
    success:
      'You updated contractor information for <bold>{{-contractor}}</bold>.',
    error:
      'There was an issue editing this contractor. Please try again, and if the problem persists, try again later.'
  },
  removeContractor: {
    title: 'Are you sure you want to remove this contractor?',
    text: '<bold>Contractor to be removed: </bold>{{-contact}}',
    cta: 'Remove contractor',
    success: 'You removed <bold>{{-contact}}</bold> as a contractor.',
    error:
      'There was an issue removing this contractor. Please try again, and if the problem persists, try again later.'
  },
  allFieldsRequired:
    'Fields marked with an asterisk ( <s>*</s> ) are required.',
  actionWarning: 'This action cannot be undone.',
  cancel: 'Cancel',
  duplicateError:
    '<bold>{{-contractor}}</bold> is already added to this solution and cannot be added again. Please edit the existing entry.',
  alert:
    'This point of contact will receive notifications when this solution is selected. Please make sure this individual should receive these notifications before you proceed.'
};
export default mtoCommonSolutionContractor;
