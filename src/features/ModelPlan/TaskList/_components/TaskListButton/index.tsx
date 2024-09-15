import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { PrepareForClearanceStatus, TaskStatus } from 'gql/gen/graphql';

import Alert from 'components/Alert';

type TaskListButtonProps = {
  ariaLabel?: string;
  path: string;
  disabled?: boolean;
  status: TaskStatus | PrepareForClearanceStatus;
};

const TaskListButton = ({
  ariaLabel,
  path,
  disabled,
  status
}: TaskListButtonProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { modelID } = useParams<{ modelID: string }>();
  const history = useHistory();

  const ctaCopy = () => {
    if (status === TaskStatus.READY) {
      return t('taskListButton.start');
    }
    if (
      status === TaskStatus.READY_FOR_REVIEW ||
      status === TaskStatus.READY_FOR_CLEARANCE
    ) {
      return t('taskListButton.update');
    }
    if (status === 'IN_PROGRESS' && path !== 'prepare-for-clearance') {
      return t('taskListButton.continue');
    }
    if (status === 'IN_PROGRESS' && path === 'prepare-for-clearance') {
      return t('taskListButton.updateStatuses');
    }
    return '';
  };

  return (
    <>
      {status === 'CANNOT_START' ? (
        <Alert type="info">{t('cannotStartClearance')}</Alert>
      ) : (
        <button
          type="button"
          disabled={disabled}
          data-testid={path}
          className="usa-button margin-bottom-2 width-auto"
          onClick={() =>
            history.push(
              `/models/${modelID}/collaboration-area/task-list/${path}`
            )
          }
          aria-label={`${ctaCopy()} ${ariaLabel?.toLowerCase()}`}
        >
          {ctaCopy()}
        </button>
      )}
    </>
  );
};

export default TaskListButton;
