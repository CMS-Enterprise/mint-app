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
  const { modelId } = useParams<{ modelId: string }>();
  const history = useHistory();

  const handleCreatePlanBasics = () => {
    history.push(`/models/${modelId}/task-list/${path}`);
  };

  if (status === 'CANNOT_START' || status === 'COMPLETE') {
    return <></>;
  }

  return (
    <Button type="button" onClick={handleCreatePlanBasics}>
      {status === 'READY'
        ? t('taskListButton.start')
        : t('taskListButton.continue')}
    </Button>
  );
};

export default TaskListButton;
