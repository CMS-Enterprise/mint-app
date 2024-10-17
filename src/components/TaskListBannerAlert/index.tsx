import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { GridContainer } from '@trussworks/react-uswds';

import Alert from 'components/Alert';

import './index.scss';

const taskListRoutes: string[] = [
  'basics',
  'beneficiaries',
  'characteristics',
  'ops-eval-and-learning',
  'participants-and-providers',
  'payment'
];

const isTaskListRoute = (route: string | undefined) =>
  taskListRoutes.includes(route || '');

const TaskListBannerAlert = () => {
  const { t } = useTranslation('general');
  const location = useLocation();

  const [banner, setBanner] = useState<JSX.Element>(<></>);

  const isTaskList = location.pathname.split('/')[4] === 'task-list';

  const taskListRoute = isTaskListRoute(location.pathname.split('/')[5]);

  useEffect(() => {
    if (isTaskList && taskListRoute) {
      setBanner(
        <div className="task-list-alert" data-testid="task-list-alert">
          <GridContainer>
            <Alert type="info" slim className="margin-top-0 border-0">
              {t('taskListLockBanner')}
            </Alert>
          </GridContainer>
        </div>
      );
    } else {
      setBanner(<></>);
    }
  }, [isTaskList, taskListRoute, t]);

  return banner;
};

export default TaskListBannerAlert;
