import React from 'react';
import { useTranslation } from 'react-i18next';

import UswdsReactLink from 'components/LinkWrapper';

const TaskListStatus = () => {
  const { t } = useTranslation('modelPlanTaskList');

  return (
    <div className="task-list-status">
      <p>{t('status')}</p>
      <UswdsReactLink to="/">{t('update')}</UswdsReactLink>
    </div>
  );
};

export default TaskListStatus;
