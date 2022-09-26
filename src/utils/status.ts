// Util functions for status of Model plan and task list sections

import { TaskStatus, TaskStatusInput } from 'types/graphql-global-types';

// Util function for prepping TaskStatus for mutation input of TaskStatusInput
const sanitizeStatus = (status: TaskStatus): TaskStatusInput => {
  return status === TaskStatus.READY
    ? TaskStatusInput.IN_PROGRESS
    : TaskStatusInput[status];
};

export default sanitizeStatus;
