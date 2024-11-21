import { TranslationMTOCategory } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const mtoMilestones: TranslationMTOCategory = {
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'Milestone title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.0
  }
};

export default mtoMilestones;
