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
  remove: {
    title: 'Are you sure you want to remove this subject category?',
    actionWarning:
      'This action cannot be undone. All SMEs in this category will also be removed. If you do not wish to remove the, edit the SMEs to change their category before removing this category.',
    text: '<bold>Category to be removed:</bold> {{-name}}',
    cta: 'Remove category'
  },
  currentCategory: '<bold>Current category title:</bold>  {{-category}}',
  cancel: 'Cancel',
  allFieldsRequired: 'Fields marked with an asterisk ( <s>*</s> ) are required.'
};

export default keyContactCategory;
