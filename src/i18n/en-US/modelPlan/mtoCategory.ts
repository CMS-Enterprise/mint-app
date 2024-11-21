import { TranslationMTOCategory } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const mtoCategory: TranslationMTOCategory = {
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'New category title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.0
  }
};

export default mtoCategory;
