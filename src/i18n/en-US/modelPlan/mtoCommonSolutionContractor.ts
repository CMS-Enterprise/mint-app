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
    contractorTitle: {
      gqlField: 'contractorTitle',
      goField: 'ContractorTitle',
      dbField: 'contractor_title',
      label: 'Contractor Title',
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

export default mtoCommonSolutionContractor;
