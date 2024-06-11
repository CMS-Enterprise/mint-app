import { TranslationCRs } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

export const crs: TranslationCRs = {
  idNumber: {
    gqlField: 'idNumber',
    goField: 'IdNumber',
    dbField: 'id_number',
    label: 'ID number',
    sublabel: 'Please include the prefix. Ex. CR-123456',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01
  },
  title: {
    gqlField: 'title',
    goField: 'title',
    dbField: 'title',
    label: 'CR title',
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
  dateImplemented: {
    gqlField: 'dateImplemented',
    goField: 'DateImplemented',
    dbField: 'date_implemented',
    label: 'Implementation date',
    sublabel: 'For example: April 2024',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.SELECT,
    order: 1.04
  },
  note: {
    gqlField: 'note',
    goField: 'note',
    dbField: 'note',
    label: 'Optional notes',
    sublabel:
      'Add any details about this CR that would be helpful to know at a glance',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXTAREA,
    order: 1.05
  }
};

export default crs;
