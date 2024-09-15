import { TranslationTDLs } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const tdls: TranslationTDLs = {
  idNumber: {
    gqlField: 'idNumber',
    goField: 'IdNumber',
    dbField: 'id_number',
    label: 'ID number',
    sublabel: 'Please include the prefix. Ex. TDL-123456',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01
  },
  title: {
    gqlField: 'title',
    goField: 'title',
    dbField: 'title',
    label: 'TDL title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.02
  },
  dateInitiated: {
    gqlField: 'dateInitiated',
    goField: 'DateInitiated',
    dbField: 'date_initiated',
    label: 'Initiated date',
    sublabel: 'mm/dd/yyyy',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.DATEPICKER,
    order: 1.03
  },
  note: {
    gqlField: 'note',
    goField: 'note',
    dbField: 'note',
    label: 'Optional notes',
    sublabel:
      'Add any details about this TDL that would be helpful to know at a glance',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.04
  }
};

export default tdls;
