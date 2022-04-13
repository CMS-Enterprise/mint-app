import React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

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
  heading: string;
  status: string;
  children?: React.ReactNode | React.ReactNodeArray;
  testId: string;
};

const TaskListItem = ({
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

  return (
    <li className={taskListItemClasses} data-testid={testId}>
      <div className="model-plan-task-list__task-content">
        <div className="model-plan-task-list__task-heading-row">
          <h3 className="model-plan-task-list__task-heading margin-top-0">
            {heading}
          </h3>
          <span
            className={classnames('model-plan-task-list__task-tag', {
              'model-plan-task-list__task-tag--ready': status === 'READY',
              'model-plan-task-list__task-tag--in-progress':
                status === 'IN_PROGRESS',
              'model-plan-task-list__task-tag--completed':
                status === 'COMPLETED',
              'model-plan-task-list__task-tag--na':
                status === 'CANNOT_START' || status === 'NOT_NEEDED'
            })}
            data-testid="task-list-task-tag"
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
