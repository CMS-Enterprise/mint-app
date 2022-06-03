import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

type TaskListButtonProps = {
  path: string;
  status: 'READY' | 'IN_PROGRESS' | 'CANNOT_START' | 'COMPLETE';
};

const TaskListButton = ({ path, status }: TaskListButtonProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { modelID } = useParams<{ modelID: string }>();
  const history = useHistory();

  if (status === 'CANNOT_START') {
    return <></>;
  }

  return (
    <Button
      type="button"
      onClick={() => history.push(`/models/${modelID}/task-list/${path}`)}
    >
      {status === 'READY'
        ? t('taskListButton.start')
        : t('taskListButton.continue')}
    </Button>
  );
};

export default TaskListButton;
