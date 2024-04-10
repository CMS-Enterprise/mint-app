import { TranslationOperationalSolutionSubtasks } from 'types/translation';

const operationalSolutionSubtasks: TranslationOperationalSolutionSubtasks = {
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'Subtask name',
    dataType: 'string',
    formType: 'text'
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'What is the status of this subtask?',
    dataType: 'enum',
    formType: 'checkbox',
    options: {
      DONE: 'Done',
      IN_PROGRESS: 'In progress',
      TODO: 'To do'
    }
  }
};

export default operationalSolutionSubtasks;
