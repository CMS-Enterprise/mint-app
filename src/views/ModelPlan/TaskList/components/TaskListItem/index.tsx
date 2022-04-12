import React from 'react';
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
  const taskListItemClasses = classnames(
    'model-plan-task-list__item',
    'padding-bottom-4',
    {
      'model-plan-task-list__item--na': ['NOT_NEEDED', 'CANNOT_START'].includes(
        status
      )
    }
  );
  return (
    <li className={taskListItemClasses} data-testid={testId}>
      <div className="model-plan-task-list__task-content">
        <div className="model-plan-task-list__task-heading-row">
          <h3 className="model-plan-task-list__task-heading margin-top-0">
            {heading}
          </h3>
          {status === 'CANNOT_START' && (
            <span
              className="model-plan-task-list__task-tag model-plan-task-list__task-tag--na"
              data-testid="task-list-task-tag"
            >
              Cannot start yet
            </span>
          )}
          {status === 'COMPLETED' && (
            <span
              className="model-plan-task-list__task-tag model-plan-task-list__task-tag--completed"
              data-testid="task-list-task-tag"
            >
              Completed
            </span>
          )}
          {status === 'NOT_NEEDED' && (
            <span
              className="model-plan-task-list__task-tag model-plan-task-list__task-tag--na"
              data-testid="task-list-task-tag"
            >
              Not needed
            </span>
          )}
        </div>
        {children}
      </div>
    </li>
  );
};

export default TaskListItem;
