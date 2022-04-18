import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

type TaskListLastUpdatedProps = {
  children?: React.ReactNode | React.ReactNodeArray;
};

export const TaskListLastUpdated = ({ children }: TaskListLastUpdatedProps) => {
  return (
    <div className="model-plan-task-list__last-updated-status line-height-body-4">
      {children}
    </div>
  );
};

type TaskListDescriptionProps = {
  children?: React.ReactNode | React.ReactNodeArray;
};

export const TaskListDescription = ({ children }: TaskListDescriptionProps) => {
  return (
    <div className="model-plan-task-list__task-description line-height-body-4">
      {children}
    </div>
  );
};

type TaskListItemProps = {
  keyName: string;
  heading: string;
  status: string;
  children?: React.ReactNode | React.ReactNodeArray;
  testId: string;
};

const TaskListItem = ({
  keyName,
  heading,
  status,
  children,
  testId
}: TaskListItemProps) => {
  const { t } = useTranslation('modelPlanTaskList');

  const taskListItemClasses = classnames(
    'model-plan-task-list__item',
    'padding-bottom-4',
    {
      'model-plan-task-list__item--na': ['NOT_NEEDED', 'CANNOT_START'].includes(
        status
      )
    }
  );

  const tagCopy =
    (status === 'READY' && t('taskListItem.ready')) ||
    (status === 'IN_PROGRESS' && t('taskListItem.inProgress')) ||
    (status === 'COMPLETED' && t('taskListItem.completed')) ||
    (status === 'CANNOT_START' && t('taskListItem.cannotStart')) ||
    (status === 'NOT_NEEDED' && t('taskListItem.notNeeded'));

  const tagStyle =
    (status === 'READY' && 'ready') ||
    (status === 'IN_PROGRESS' && 'in-progress') ||
    (status === 'COMPLETED' && 'completed') ||
    ((status === 'CANNOT_START' || status === 'NOT_NEEDED') && 'na');

  return (
    <li className={taskListItemClasses} data-testid={testId}>
      <div className="model-plan-task-list__task-content">
        <div className="model-plan-task-list__task-heading-row">
          <h3 className="model-plan-task-list__task-heading margin-top-0 margin-bottom-1">
            {heading}
          </h3>
          <span
            className={`model-plan-task-list__task-tag model-plan-task-list__task-tag--${tagStyle}`}
            data-testid={`task-list-task-tag--${keyName}`}
          >
            {tagCopy}
          </span>
        </div>
        {children}
      </div>
    </li>
  );
};

export default TaskListItem;
