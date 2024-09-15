import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';
import {
  ModelStatus,
  PrepareForClearanceStatus,
  TaskStatus
} from 'gql/gen/graphql';

type TaskListDescriptionProps = {
  children?: React.ReactNode | React.ReactNodeArray;
};

export const TaskListDescription = ({ children }: TaskListDescriptionProps) => {
  return (
    <div className="model-plan-task-list__task-description margin-right-auto line-height-body-4">
      {children}
    </div>
  );
};

export const TaskListStatusTag = ({
  status,
  classname
}: {
  status: TaskStatus | PrepareForClearanceStatus | ModelStatus | undefined;
  classname?: string;
}) => {
  const { t } = useTranslation('modelPlanTaskList');

  let tagStyle;
  let tagCopy;
  switch (status) {
    case 'IN_PROGRESS':
      tagCopy = t('taskListStatus.IN_PROGRESS');
      tagStyle = 'bg-warning';
      break;
    case 'READY_FOR_REVIEW':
      tagCopy = t('taskListStatus.READY_FOR_REVIEW');
      tagStyle = 'bg-success-dark text-white';
      break;
    case 'READY':
      tagCopy = t('taskListStatus.READY');
      tagStyle = 'bg-info-light';
      break;
    case 'READY_FOR_CLEARANCE':
      tagCopy = t('taskListStatus.READY_FOR_CLEARANCE');
      tagStyle = 'bg-base-lighter text-base-darker';
      break;
    case 'CANNOT_START':
      tagCopy = t('taskListStatus.CANNOT_START');
      tagStyle = 'bg-white border-2px text-base';
      break;
    default:
      tagCopy = '';
      tagStyle = 'bg-info-light';
  }

  return (
    <div
      data-testid="tasklist-tag"
      className={`model-plan-task-list__task-tag line-height-body-1 text-bold mint-no-print ${tagStyle} ${
        classname ?? ''
      }`}
    >
      <span>{tagCopy}</span>
    </div>
  );
};

type TaskListItemProps = {
  children?: React.ReactNode | React.ReactNodeArray;
  heading: string;
  status: TaskStatus | PrepareForClearanceStatus;
  testId: string;
  lastUpdated?: string | null;
};

const TaskListItem = ({
  children,
  heading,
  status,
  testId,
  lastUpdated
}: TaskListItemProps) => {
  const { t } = useTranslation('modelPlanTaskList');

  const taskListItemClasses = classnames(
    'model-plan-task-list__item',
    'display-flex',
    'padding-bottom-4'
  );

  return (
    <li className={taskListItemClasses} data-testid={testId}>
      <div className="width-full">
        <div className="model-plan-task-list__task-row display-flex flex-justify flex-align-start">
          <h3 className="margin-top-0 margin-bottom-1">{heading}</h3>
          <span className="display-flex flex-column flex-align-end">
            <TaskListStatusTag status={status} />
            <div className="model-plan-task-list__last-updated-status line-height-body-4 text-base">
              {lastUpdated && <p className="margin-y-0">{t('lastUpdated')}</p>}
              <p className="margin-y-0">{lastUpdated}</p>
            </div>
          </span>
        </div>
        {children}
      </div>
    </li>
  );
};

export default TaskListItem;
