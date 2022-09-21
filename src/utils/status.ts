// Util functions for status of Model plan and task list sections

import { TaskStatus } from 'types/graphql-global-types';

// Util function for prepping TaskStatus for mutation input of TaskStatusInput
const sanitizeStatus = (status: TaskStatus) => {
  return status === TaskStatus.READY ? TaskStatus.IN_PROGRESS : status;
};

export default sanitizeStatus;
