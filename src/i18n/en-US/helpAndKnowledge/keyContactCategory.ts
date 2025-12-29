import { TranslationKeyContactCategoryCustom } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const keyContactCategory: TranslationKeyContactCategoryCustom = {
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
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
    cta: 'Add subject category',
    success: 'You added <bold>{{-category}}</bold> as a subject category.',
    error: 'There was an issue adding this subject category.'
  },
  edit: {
    heading: 'Rename a subject category',
    cta: 'Save changes',
    success: 'You renamed subject category <bold>{{-category}}</bold>.',
    error: 'There was an issue renaming this subject category.'
  },
  remove: {
    title: 'Are you sure you want to remove this subject category?',
    actionWarning:
      'This action cannot be undone. All SMEs in this category will also be removed. If you do not wish to remove them, edit the SMEs to change their category before removing this category.',
    text: '<bold>Category to be removed:</bold> {{-name}}',
    cta: 'Remove category',
    success: 'You removed <bold>{{-name}}</bold> as a subject category.',
    error: 'There was an issue removing this subject category.'
  },
  currentCategory: '<bold>Current category title:</bold>  {{-category}}',
  cancel: 'Cancel',
  allFieldsRequired: 'Fields marked with an asterisk ( <s>*</s> ) are required.'
};

export default keyContactCategory;
