import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import { TaskStatus } from 'types/graphql-global-types';

type TaskListButtonProps = {
  path: string;
  disabled?: boolean;
  status: TaskStatus;
};

const TaskListButton = ({ path, disabled, status }: TaskListButtonProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { modelID } = useParams<{ modelID: string }>();
  const history = useHistory();

  return (
    <Button
      type="button"
      disabled={disabled}
      data-testid={path}
      onClick={() => history.push(`/models/${modelID}/task-list/${path}`)}
    >
      {status === 'READY' && t('taskListButton.start')}
      {status === 'IN_PROGRESS' && t('taskListButton.continue')}
      {status === 'READY_FOR_REVIEW' && t('taskListButton.update')}
    </Button>
  );
};

export default TaskListButton;
