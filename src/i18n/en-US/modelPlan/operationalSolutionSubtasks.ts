import { TranslationOperationalSolutionSubtasks } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

const operationalSolutionSubtasks: TranslationOperationalSolutionSubtasks = {
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'Subtask name',
    exportLabel: 'Subtask',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'What is the status of this subtask?',
    exportLabel: 'Status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.CHECKBOX,
    options: {
      DONE: 'Done',
      IN_PROGRESS: 'In progress',
      TODO: 'To do'
    }
  }
};

export default operationalSolutionSubtasks;
