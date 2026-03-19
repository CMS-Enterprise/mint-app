import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import classnames from 'classnames';
import {
  GetCollaborationAreaQuery,
  PlanTaskState,
  useGetCollaborationAreaQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';

import './index.scss';
import 'components/Tabs/index.scss';

type PlanTaskEntry = GetCollaborationAreaQuery['modelPlan']['tasks'][number];

type TabId = 'current' | 'completed';

const getTabIdFromSearchParams = (tab: string | null): TabId => {
  return tab === 'completed' ? 'completed' : 'current';
};

const getCompletedDts = (task: PlanTaskEntry): string => {
  // `completedDts` is requested by the updated `GetCollaborationArea` operation.
  // Until codegen catches up, keep this access tolerant for runtime/test mocks.
  return ((task as any).completedDts ?? '') as string;
};

const Tasks = () => {
  const { t } = useTranslation('tasks');
  const navigate = useNavigate();
  const { modelID = '' } = useParams<{ modelID: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabId = getTabIdFromSearchParams(searchParams.get('tab'));

  const { data, loading, error } = useGetCollaborationAreaQuery({
    variables: { id: modelID }
  });

  const tasks = data?.modelPlan?.tasks ?? [];

  const currentTasks = tasks.filter(
    task => task.state !== PlanTaskState.COMPLETE
  );
  const completedTasks = tasks.filter(
    task => task.state === PlanTaskState.COMPLETE
  );

  const completedTasksNewestToOldest = [...completedTasks].sort((a, b) => {
    const aDts = getCompletedDts(a);
    const bDts = getCompletedDts(b);
    return (bDts || '').localeCompare(aDts || '');
  });

  const tabs = [
    {
      id: 'current' as const,
      label: t('tabs.current', { count: currentTasks.length })
    },
    {
      id: 'completed' as const,
      label: t('tabs.completed', { count: completedTasks.length })
    }
  ];

  const handleTabClick = (nextTabId: TabId) => {
    setSearchParams({ tab: nextTabId });
  };

  if (loading) {
    return (
      <MainContent className="model-plan-tasks">
        <div className="height-viewport">
          <PageLoading />
        </div>
      </MainContent>
    );
  }

  if (error) {
    return (
      <MainContent className="model-plan-tasks">
        <Alert type="error" heading={t('errorHeading') ?? ''}>
          {t('errorMessage') ?? ''}
        </Alert>
      </MainContent>
    );
  }

  return (
    <MainContent className="model-plan-tasks" data-testid="tasks-page">
      <PageHeading className="margin-top-4 margin-bottom-4">Tasks</PageHeading>

      <div className="mint-tabs">
        <ul className="mint-tabs__tab-list" role="tablist">
          {tabs.map(tab => {
            const isSelected = tabId === tab.id;

            return (
              <li
                key={tab.id}
                className={classnames('mint-tabs__tab', {
                  'mint-tabs__tab--selected': isSelected
                })}
                role="presentation"
                data-testid={`${tab.id}-tab`}
              >
                <button
                  id={`${tab.id}-tab-btn`}
                  type="button"
                  role="tab"
                  className="mint-tabs__tab-btn"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? undefined : -1}
                  aria-controls={`${tab.id}-panel`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  <span className="mint-tabs__tab-text">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {tabId === 'current' && (
        <section
          id="current-panel"
          role="tabpanel"
          className="mint-tabs__tab-panel"
        >
          {currentTasks.length === 0 ? (
            <Alert type="info" heading={t('emptyState.heading')}>
              <div className="display-flex flex-direction-column gap-2">
                <span>{t('emptyState.copy')}</span>
                <Trans
                  i18nKey="tasks:emptyState.viewCompletedTasks"
                  components={{
                    link1: (
                      <UswdsReactLink
                        to={`/models/${modelID}/collaboration-area/tasks?tab=completed`}
                        className="deep-underline"
                      />
                    )
                  }}
                />
              </div>
            </Alert>
          ) : (
            <ol className="model-plan-tasks__list padding-left-0 margin-top-0 margin-bottom-0">
              {currentTasks.map(task => {
                const baseKey = `${task.key}.${task.status}`;
                const heading = t(`${baseKey}.heading`);
                const primaryAction = t(`${baseKey}.primaryAction`);
                const primaryPath = t(
                  `${task.key}.${task.status}.primaryPath`,
                  {
                    modelID
                  }
                );

                return (
                  <li key={task.key} className="model-plan-tasks__list-item">
                    <div className="model-plan-tasks__row display-flex flex-justify flex-align-center">
                      <h3 className="margin-0">{heading}</h3>
                      <Button
                        type="button"
                        className="margin-left-4"
                        onClick={() => navigate(primaryPath)}
                      >
                        {primaryAction}
                      </Button>
                    </div>
                    <div className="model-plan-tasks__state">
                      {t(`state.${task.state}`)}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      )}

      {tabId === 'completed' && (
        <section
          id="completed-panel"
          role="tabpanel"
          className="mint-tabs__tab-panel"
        >
          {completedTasksNewestToOldest.length === 0 ? (
            <Alert type="info">{t('emptyCompletedTasks')}</Alert>
          ) : (
            <ol className="model-plan-tasks__list padding-left-0 margin-top-0 margin-bottom-0">
              {completedTasksNewestToOldest.map(task => {
                const baseKey = `${task.key}.${task.status}`;
                const heading = t(`${baseKey}.heading`);
                const primaryAction = t(`${baseKey}.primaryAction`);
                const primaryPath = t(
                  `${task.key}.${task.status}.primaryPath`,
                  {
                    modelID
                  }
                );

                return (
                  <li key={task.key} className="model-plan-tasks__list-item">
                    <div className="model-plan-tasks__row display-flex flex-justify flex-align-center">
                      <h3 className="margin-0">{heading}</h3>
                      <Button
                        type="button"
                        className="margin-left-4"
                        onClick={() => navigate(primaryPath)}
                      >
                        {primaryAction}
                      </Button>
                    </div>
                    <div className="model-plan-tasks__state">
                      {t(`state.${task.state}`)}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      )}
    </MainContent>
  );
};

export default Tasks;
