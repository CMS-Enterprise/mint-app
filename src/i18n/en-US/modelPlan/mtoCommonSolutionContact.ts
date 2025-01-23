import { TranslationMTOCommonSolutionContactCustom } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const mtoCommonSolutionContact: TranslationMTOCommonSolutionContactCustom =
  {
    email: {
      gqlField: 'email',
      goField: 'Email',
      dbField: 'email',
      label: 'Email',
      dataType: TranslationDataType.STRING,
      formType: TranslationFormType.TEXT,
      order: 1.0
    },
    isPrimary: {
      gqlField: 'isPrimary',
      goField: 'IsPrimary',
      dbField: 'is_primary',
      label: 'Is Primary',
      dataType: TranslationDataType.BOOLEAN,
      formType: TranslationFormType.CHECKBOX,
      order: 1.1
    },
    key: {
      gqlField: 'key',
      goField: 'Key',
      dbField: 'mto_common_solution_key',
      label: 'MTO Common Solution Contact',
      dataType: TranslationDataType.ENUM,
      formType: TranslationFormType.TEXT,
      tableReference: TableName.MTO_COMMON_SOLUTION,
      order: 1.2
    },
    name: {
      gqlField: 'name',
      goField: 'Name',
      dbField: 'name',
      label: 'Name',
      dataType: TranslationDataType.STRING,
      formType: TranslationFormType.TEXT,
      order: 1.3
    },
    role: {
      gqlField: 'role',
      goField: 'Role',
      dbField: 'role',
      label: 'Role',
      dataType: TranslationDataType.STRING,
      formType: TranslationFormType.TEXT,
      order: 1.4
    },
    isTeam: {
      gqlField: 'isTeam',
      goField: 'IsTeam',
      dbField: 'is_team',
      label: 'Is Team',
      dataType: TranslationDataType.BOOLEAN,
      formType: TranslationFormType.CHECKBOX,
      order: 1.5
    }
  };

export default mtoCommonSolutionContact;
