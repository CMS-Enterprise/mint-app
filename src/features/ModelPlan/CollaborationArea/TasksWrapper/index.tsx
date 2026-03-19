import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CardGroup, Icon } from '@trussworks/react-uswds';
import {
  GetCollaborationAreaQuery,
  PlanTaskKey,
  PlanTaskState
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';

import TaskCard from '../Cards/TaskCard';

// Fixed order per AC: Start Model Plan → Start MTO → Start Data Exchange
const TASK_KEY_ORDER: PlanTaskKey[] = [
  PlanTaskKey.MODEL_PLAN,
  PlanTaskKey.MTO,
  PlanTaskKey.DATA_EXCHANGE
];

type TasksWrapperProps = {
  modelPlan: GetCollaborationAreaQuery['modelPlan'];
  tasks: GetCollaborationAreaQuery['modelPlan']['tasks'];
};

const TasksWrapper = ({ modelPlan, tasks }: TasksWrapperProps) => {
  const { t } = useTranslation('tasks');
  const { t: tableAndPaginationT } = useTranslation('tableAndPagination');
  const { modelID = '' } = useParams<{ modelID: string }>();
  const navigate = useNavigate();

  const incompleteTasks = tasks.filter(
    incompleteTask => incompleteTask.state !== PlanTaskState.COMPLETE
  );
  const orderedTasks = TASK_KEY_ORDER.flatMap(key => {
    const taskForKey = incompleteTasks.find(
      incompleteTask => incompleteTask.key === key
    );
    return taskForKey ? [taskForKey] : [];
  });

  const hasNoCurrentTasks = orderedTasks.length === 0;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const maxIndex = Math.max(0, orderedTasks.length - 1);
    setCurrentIndex(prev => Math.min(prev, maxIndex));
  }, [orderedTasks.length]);

  if (hasNoCurrentTasks) {
    return (
      <>
        <Alert
          type="info"
          heading={t('emptyState.current.heading')}
          className="margin-bottom-3"
        >
          {t('emptyState.current.copy')}{' '}
          <Trans
            i18nKey="tasks:emptyState.current.viewCompletedTasks"
            components={{
              link1: (
                <UswdsReactLink
                  to={`/models/${modelID}/collaboration-area/tasks?tab=completed`}
                  className="deep-underline"
                />
              )
            }}
          />
        </Alert>
        <div className="display-flex flex-justify-end">
          <Button
            type="button"
            unstyled
            className="deep-underline"
            onClick={() => {
              navigate(
                `/models/${modelID}/collaboration-area/tasks?tab=current`
              );
            }}
          >
            {t('seeAllTasks')}
          </Button>
        </div>
      </>
    );
  }

  const currentTask = orderedTasks[currentIndex];

  return (
    <div>
      <CardGroup>
        <TaskCard task={currentTask} modelPlan={modelPlan} />
      </CardGroup>

      <div className="display-flex flex-align-center flex-justify">
        <div className="display-flex flex-align-center">
          <Button
            type="button"
            unstyled
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className="usa-button--unstyled"
          >
            <Icon.NavigateBefore
              aria-label={tableAndPaginationT('pagination.previous')}
            />
            {tableAndPaginationT('pagination.previous')}
          </Button>
          <span className="margin-x-3 text-base">|</span>
          <Button
            type="button"
            unstyled
            disabled={currentIndex === orderedTasks.length - 1}
            onClick={() =>
              setCurrentIndex(prev =>
                Math.min(orderedTasks.length - 1, prev + 1)
              )
            }
            className="usa-button--unstyled"
          >
            {tableAndPaginationT('pagination.next')}
            <Icon.NavigateNext
              aria-label={tableAndPaginationT('pagination.next')}
            />
          </Button>
        </div>
        <div className="display-flex flex-align-center margin-left-auto">
          <Button
            type="button"
            unstyled
            className="usa-link"
            onClick={() => {
              navigate(
                `/models/${modelID}/collaboration-area/tasks?tab=current`
              );
            }}
          >
            {t('seeAll', { count: orderedTasks.length })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TasksWrapper;
