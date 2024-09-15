import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';

import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';

interface LocationState {
  state: {
    error: boolean;
    route: string;
  };
  error: boolean;
  route: string;
}
const LockedTaskListSection = () => {
  const { t } = useTranslation('modelPlanTaskList');
  const location = useLocation<LocationState>();
  const { error, route } = location?.state;
  const { modelID } = useParams<{ modelID: string }>();

  return (
    <MainContent className="mint-not-found grid-container">
      {route && (
        <Breadcrumbs
          items={[
            BreadcrumbItemOptions.HOME,
            BreadcrumbItemOptions.COLLABORATION_AREA,
            BreadcrumbItemOptions.TASK_LIST
          ]}
          customItem={t(`breadCrumbState.${route}`)}
        />
      )}

      {!error ? (
        <div className="margin-y-7">
          <PageHeading className="margin-bottom-2" data-testid="page-locked">
            {t('lockedHeading')}
          </PageHeading>
          <p>{t('lockedSubheading')}</p>

          <UswdsReactLink
            className="usa-button margin-top-6"
            variant="unstyled"
            to={`/models/${modelID}/collaboration-area/task-list`}
          >
            {t('returnToTaskList')}
          </UswdsReactLink>
        </div>
      ) : (
        <div className="margin-y-7">
          <PageHeading className="margin-bottom-2" data-testid="page-error">
            {t('lockErrorHeading')}
          </PageHeading>
          <p>{t('lockErrorInfo')}</p>

          <UswdsReactLink
            className="usa-button margin-top-6"
            variant="unstyled"
            to={`/models/${modelID}/collaboration-area/task-list`}
          >
            {t('returnToTaskList')}
          </UswdsReactLink>
        </div>
      )}
    </MainContent>
  );
};

export default LockedTaskListSection;
