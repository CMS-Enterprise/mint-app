import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';

type TaskListButtonProps = {
  path: string;
  status: string;
};

const TaskListButton = ({ path, status }: TaskListButtonProps) => {
  const { t } = useTranslation('modelPlanTaskList');

  if (status === 'CANNOT_START') {
    return <></>;
  }

  return (
    <UswdsReactLink
      className="usa-button"
      variant="unstyled"
      to={`task-list/${path}`}
    >
      {status === 'READY'
        ? t('taskListButton.start')
        : t('taskListButton.continue')}
    </UswdsReactLink>
  );
};

export default TaskListButton;
