import { TranslationKeyContactCategoryCustom } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const keyContactCategory: TranslationKeyContactCategoryCustom = {
  category: {
    gqlField: 'category',
    goField: 'Category',
    dbField: 'category',
    label: 'Subject category title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1
  }
};

export const keyContactCategoryMisc = {
  add: {
    heading: 'Add a subject category',
    description:
      'Add an overall category or topic for subject matter experts (e.g. “Quality” or “Medicare Advantage”).',
    cta: 'Add subject category'
  },
  edit: { heading: 'Rename a subject category', cta: 'Save changes' },
  currentCategory: '<bold>Current category title:</bold>  {{-category}}',
  cancel: 'Cancel',
  allFieldsRequired: 'Fields marked with an asterisk ( <s>*</s> ) are required.'
};

export default keyContactCategory;
