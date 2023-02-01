import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import Alert from 'components/shared/Alert';
import {
  PrepareForClearanceStatus,
  TaskStatus
} from 'types/graphql-global-types';

type TaskListButtonProps = {
  path: string;
  disabled?: boolean;
  status: TaskStatus | PrepareForClearanceStatus;
};

const TaskListButton = ({ path, disabled, status }: TaskListButtonProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { modelID } = useParams<{ modelID: string }>();
  const history = useHistory();

  return (
    <>
      {status === 'CANNOT_START' ? (
        <Alert type="info">{t('cannotStartClearance')}</Alert>
      ) : (
        <Button
          type="button"
          disabled={disabled}
          data-testid={path}
          className="margin-bottom-2 width-auto"
          onClick={() => history.push(`/models/${modelID}/task-list/${path}`)}
        >
          {status === 'READY' && t('taskListButton.start')}
          {status === 'IN_PROGRESS' &&
            path !== 'prepare-for-clearance' &&
            t('taskListButton.continue')}
          {status === 'IN_PROGRESS' &&
            path === 'prepare-for-clearance' &&
            t('taskListButton.updateStatuses')}
          {status === 'READY_FOR_REVIEW' && t('taskListButton.update')}
          {status === 'READY_FOR_CLEARANCE' && t('taskListButton.update')}
        </Button>
      )}
    </>
  );
};

export default TaskListButton;
