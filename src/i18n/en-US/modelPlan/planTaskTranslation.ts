import { TranslationFieldPropertiesWithOptions } from 'types/translation';

import {
  PlanTaskStatus,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export type TranslationPlanTask = {
  status: TranslationFieldPropertiesWithOptions<PlanTaskStatus>;
};

export const planTaskTranslation: TranslationPlanTask = {
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Task status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    order: 1.01,
    options: {
      [PlanTaskStatus.NOT_NEEDED]: 'Not needed',
      [PlanTaskStatus.UPCOMING]: 'Upcoming',
      [PlanTaskStatus.TO_DO]: 'To do',
      [PlanTaskStatus.IN_PROGRESS]: 'In progress',
      [PlanTaskStatus.COMPLETE]: 'Complete'
    },
    hideFromReadonly: true
  }
};

export default planTaskTranslation;
