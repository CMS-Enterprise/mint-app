import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

type TaskListLastUpdatedProps = {
  children?: React.ReactNode | React.ReactNodeArray;
};

export const TaskListLastUpdated = ({ children }: TaskListLastUpdatedProps) => {
  return (
    <div className="model-plan-task-list__last-updated-status line-height-body-4 padding-top-1 text-base">
      {children}
    </div>
  );
};

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

type TaskListItemProps = {
  children?: React.ReactNode | React.ReactNodeArray;
  heading: string;
  status: 'READY' | 'IN_PROGRESS' | 'CANNOT_START' | 'COMPLETE';
  testId: string;
};

const TaskListItem = ({
  children,
  heading,
  status,
  testId
}: TaskListItemProps) => {
  const { t } = useTranslation('modelPlanTaskList');

  const taskListItemClasses = classnames(
    'model-plan-task-list__item',
    'display-flex',
    'padding-bottom-4',
    {
      'text-base-dark': status === 'CANNOT_START'
    }
  );

  let tagStyle;
  let tagCopy;
  switch (status) {
    case 'READY':
      tagCopy = t('taskListItem.ready');
      tagStyle = 'bg-accent-cool';
      break;
    case 'IN_PROGRESS':
      tagCopy = t('taskListItem.inProgress');
      tagStyle = 'bg-warning';
      break;
    case 'COMPLETE':
      tagCopy = t('taskListItem.completed');
      tagStyle = 'bg-success-dark text-white';
      break;
    default:
      tagCopy = t('taskListItem.cannotStart');
      tagStyle = 'text-base border-2px border-base';
  }

  return (
    <li className={taskListItemClasses} data-testid={testId}>
      <div className="width-full">
        <div className="model-plan-task-list__task-row display-flex flex-justify flex-align-start">
          <h3 className="margin-top-0 margin-bottom-1">{heading}</h3>
          <span
            data-testid="tasklist-tag"
            className={`model-plan-task-list__task-tag line-height-5 text-bold ${tagStyle}`}
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
