import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Button,
  Grid,
  GridContainer,
  Header,
  PrimaryNav
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import {
  GetCollaborationAreaQuery,
  PlanTaskState,
  useGetCollaborationAreaQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
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
  const { t: collaborationAreaT } = useTranslation('collaborationArea');
  const navigate = useNavigate();
  const { modelID = '' } = useParams<{ modelID: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabId = getTabIdFromSearchParams(searchParams.get('tab'));

  const { data, loading, error } = useGetCollaborationAreaQuery({
    variables: { id: modelID }
  });

  const modelName = data?.modelPlan?.modelName ?? '';

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
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Breadcrumbs
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.COLLABORATION_AREA,
              BreadcrumbItemOptions.TASKS
            ]}
          />
          <div className="margin-bottom-5">
            <PageHeading className="margin-top-4 margin-bottom-0">
              {t('breadcrumb')}
            </PageHeading>
            <p
              className="margin-top-1 font-body-lg"
              data-testid="model-plan-name"
            >
              {collaborationAreaT('modelPlan', {
                modelName
              })}
            </p>
          </div>

          <Header
            basic
            extended={false}
            className="model-to-operations__nav-container margin-bottom-3  border-base-light border-bottom-1px"
          >
            <div className="usa-nav-container padding-0">
              <PrimaryNav
                items={tabs.map(tab => {
                  const isSelected = tabId === tab.id;

                  return (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={classnames(
                        'usa-nav__link margin-left-neg-2 margin-right-2',
                        {
                          'usa-current': isSelected
                        }
                      )}
                      data-testid={`${tab.id}-tab`}
                    >
                      <span
                        className={classnames({
                          'text-primary': isSelected
                        })}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
                mobileExpanded={false}
                className="flex-justify-start margin-0 padding-0"
              />
            </div>
          </Header>

          {tabId === 'current' && (
            <section
              id="current-panel"
              role="tabpanel"
              className="mint-tabs__tab-panel"
            >
              {currentTasks.length === 0 ? (
                <Alert type="info" heading={t('emptyState.current.heading')}>
                  <div className="display-flex flex-direction-column gap-2">
                    <span>{t('emptyState.current.copy')}</span>
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
                      <li
                        key={task.key}
                        className="model-plan-tasks__list-item"
                      >
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
                <Alert type="info" heading={t('emptyState.completed.heading')}>
                  {t('emptyState.completed.copy')}
                </Alert>
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
                      <li
                        key={task.key}
                        className="model-plan-tasks__list-item"
                      >
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
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Tasks;
