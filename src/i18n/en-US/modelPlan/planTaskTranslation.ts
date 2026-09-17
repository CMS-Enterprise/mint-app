import { TranslationFieldPropertiesWithOptions } from 'types/translation';

import {
  PlanTaskState,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export type TranslationPlanTask = {
  state: TranslationFieldPropertiesWithOptions<PlanTaskState>;
};

export const planTaskTranslation: TranslationPlanTask = {
  state: {
    gqlField: 'state',
    goField: 'State',
    dbField: 'state',
    label: 'Task state',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 1.01,
    options: {
      [PlanTaskState.NOT_NEEDED]: 'Not needed',
      [PlanTaskState.UPCOMING]: 'Upcoming',
      [PlanTaskState.TO_DO]: 'To do',
      [PlanTaskState.IN_PROGRESS]: 'In progress',
      [PlanTaskState.COMPLETE]: 'Complete'
    },
    hideFromReadonly: true
  }
};

export default planTaskTranslation;
