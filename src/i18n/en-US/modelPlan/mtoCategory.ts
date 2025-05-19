import { TranslationMTOCategory } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const mtoCategory: TranslationMTOCategory = {
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'New category title',
    exportLabel: 'Category title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01
  },
  position: {
    gqlField: 'position',
    goField: 'Position',
    dbField: 'position',
    label: 'Position',
    dataType: TranslationDataType.NUMBER,
    formType: TranslationFormType.NUMBER,
    order: 1.02
  },
  parentID: {
    gqlField: 'parentID',
    goField: 'ParentID',
    dbField: 'parent_id',
    label: 'Primary category',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.SELECT,
    order: 1.03,
    tableReference: TableName.MTO_CATEGORY
  }
};

export default mtoCategory;
