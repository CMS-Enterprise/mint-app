import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { TaskStatus } from 'gql/generated/graphql';

type TaskListButtonProps = {
  ariaLabel?: string;
  path: string;
  disabled?: boolean;
  status: TaskStatus;
};

const TaskListButton = ({
  ariaLabel,
  path,
  disabled,
  status
}: TaskListButtonProps) => {
  const { t } = useTranslation('modelPlanTaskList');
  const { modelID = '' } = useParams<{ modelID: string }>();
  const navigate = useNavigate();

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
    if (status === TaskStatus.IN_PROGRESS) {
      return t('taskListButton.continue');
    }
    return '';
  };

  return (
    <button
      type="button"
      disabled={disabled}
      data-testid={path}
      className="usa-button margin-bottom-0 width-auto margin-right-2"
      onClick={() =>
        navigate(`/models/${modelID}/collaboration-area/model-plan/${path}`)
      }
      aria-label={`${ctaCopy()} ${ariaLabel?.toLowerCase()}`}
    >
      {ctaCopy()}
    </button>
  );
};

export default TaskListButton;
