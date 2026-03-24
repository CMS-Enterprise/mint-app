import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import {
  CardGroup,
  Grid,
  GridContainer,
  Header,
  PrimaryNav
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import TaskCard from 'features/ModelPlan/CollaborationArea/Cards/TaskCard';
import NotFoundPartial from 'features/NotFound/NotFoundPartial';
import {
  GetCollaborationAreaQuery,
  PlanTaskKey,
  PlanTaskState,
  useGetCollaborationAreaQuery
} from 'gql/generated/graphql';
import { orderBy } from 'lodash';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';

import 'components/Tabs/index.scss';

type PlanTaskEntry = GetCollaborationAreaQuery['modelPlan']['tasks'][number];

type TabId = 'current' | 'completed';

// Current tasks are shown in this fixed order per requirements.
export const CURRENT_TASK_ORDER: PlanTaskKey[] = [
  PlanTaskKey.MODEL_PLAN,
  PlanTaskKey.DATA_EXCHANGE,
  PlanTaskKey.MTO
];

const getTabIdFromSearchParams = (tab: string | null): TabId => {
  return tab === 'completed' ? 'completed' : 'current';
};

const getCompletedDts = (task: PlanTaskEntry): string => {
  return task.completedDts ?? '';
};

const Tasks = () => {
  const { t } = useTranslation('tasks');
  const { t: collaborationAreaT } = useTranslation('collaborationArea');
  const { modelID = '' } = useParams<{ modelID: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const setTasksTab = (nextTab: TabId) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set('tab', nextTab);
      return params;
    });
  };

  const tabId = getTabIdFromSearchParams(searchParams.get('tab'));

  const { data, loading, error } = useGetCollaborationAreaQuery({
    variables: { id: modelID }
  });

  if (loading) {
    return (
      <MainContent>
        <div className="height-viewport">
          <PageLoading />
        </div>
      </MainContent>
    );
  }

  if (error || !data?.modelPlan) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  const { modelPlan } = data;
  const { modelName, tasks } = modelPlan;

  const currentTasks = CURRENT_TASK_ORDER.flatMap(key => {
    const task = tasks.find(
      planTask =>
        planTask.key === key && planTask.state !== PlanTaskState.COMPLETE
    );
    return task ? [task] : [];
  });

  const completedTasks = tasks.filter(
    task => task.state === PlanTaskState.COMPLETE
  );

  const sortedCompletedTasks = orderBy(completedTasks, getCompletedDts, 'desc');

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

  return (
    <MainContent data-testid="tasks-page">
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
            className="model-to-operations__nav-container margin-bottom-3 border-base-light border-bottom-1px"
          >
            <div className="usa-nav-container padding-0">
              <PrimaryNav
                role="tablist"
                aria-label={t('tabs.ariaLabel')}
                items={tabs.map(tab => {
                  return (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setTasksTab(tab.id)}
                      className={classnames(
                        'usa-nav__link margin-left-neg-2 margin-right-2',
                        {
                          'usa-current text-primary': tabId === tab.id
                        }
                      )}
                      data-testid={`${tab.id}-tab`}
                    >
                      {tab.label}
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
              aria-labelledby="current-tab"
              tabIndex={0}
            >
              {currentTasks.length === 0 ? (
                <Alert type="info" heading={t('emptyState.current.heading')}>
                  {t('emptyState.current.copy')}
                </Alert>
              ) : (
                <CardGroup>
                  {currentTasks.map(task => (
                    <TaskCard
                      key={task.key}
                      task={task}
                      modelPlan={modelPlan}
                    />
                  ))}
                </CardGroup>
              )}
            </section>
          )}

          {tabId === 'completed' && (
            <section
              id="completed-panel"
              role="tabpanel"
              aria-labelledby="completed-tab"
              tabIndex={0}
            >
              {sortedCompletedTasks.length === 0 ? (
                <Alert type="info" heading={t('emptyState.completed.heading')}>
                  {t('emptyState.completed.copy')}
                </Alert>
              ) : (
                <CardGroup>
                  {sortedCompletedTasks.map(task => (
                    <TaskCard
                      key={task.key}
                      task={task}
                      modelPlan={modelPlan}
                    />
                  ))}
                </CardGroup>
              )}
            </section>
          )}
        </Grid>
      </GridContainer>
    </MainContent>
  );
};

export default Tasks;
