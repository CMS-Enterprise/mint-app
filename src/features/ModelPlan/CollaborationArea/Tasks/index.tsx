import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardGroup,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import {
  GetCollaborationAreaQuery,
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';

import type { LastModifiedSectionData } from '../_components/LastModifiedSection';
import LastModifiedSection from '../_components/LastModifiedSection';
import {
  getLastModifiedSection,
  getSectionStartedCount
} from '../_utils/modelPlanSectionUtils';

type StateConfig = {
  style: string;
  icon: React.ReactNode;
};

const STATE_CONFIG: Record<PlanTaskState, StateConfig> = {
  [PlanTaskState.TO_DO]: {
    style: 'bg-warning-light',
    icon: <Icon.PriorityHigh aria-label="To do" />
  },
  [PlanTaskState.COMPLETE]: {
    style: 'bg-success-dark text-white',
    icon: <Icon.Check aria-label="Complete" />
  }
};

const StateTag = ({ state }: { state: PlanTaskState }) => {
  const { t } = useTranslation('tasks');

  const { style, icon } = STATE_CONFIG[state];

  return (
    <div
      className={`line-height-body-1 text-bold display-flex flex-align-center ${style}`}
      style={{ padding: '7px 11px', gap: '0.5rem' }}
    >
      {icon}
      <span>{t(`state.${state}`)}</span>
    </div>
  );
};

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
  const { t: collaborationAreaT } = useTranslation('collaborationArea');
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

  const lastModifiedSection = getLastModifiedSection(modelPlan);
  const sectionStartedCounter = getSectionStartedCount(modelPlan);

  function getLastEditSectionForTask(
    taskKey: PlanTaskKey
  ): LastModifiedSectionData | null {
    if (taskKey === PlanTaskKey.MODEL_PLAN) {
      return lastModifiedSection ?? null;
    }
    if (taskKey === PlanTaskKey.MTO) {
      const recentEdit = modelPlan?.mtoMatrix?.recentEdit;
      if (recentEdit?.date) {
        return {
          modifiedDts: recentEdit.date,
          modifiedByUserAccount: {
            commonName: recentEdit.actorName ?? ''
          }
        };
      }
      return null;
    }
    if (taskKey === PlanTaskKey.DATA_EXCHANGE) {
      const dataExchangeApproach =
        modelPlan?.questionnaires?.dataExchangeApproach;
      if (
        dataExchangeApproach?.modifiedDts &&
        dataExchangeApproach.modifiedByUserAccount?.commonName
      ) {
        return {
          modifiedDts: dataExchangeApproach.modifiedDts,
          modifiedByUserAccount: {
            commonName: dataExchangeApproach.modifiedByUserAccount.commonName
          }
        };
      }
      return null;
    }
    return null;
  }

  if (hasNoCurrentTasks) {
    return (
      <>
        <Alert
          type="info"
          heading={t('emptyState.heading')}
          className="margin-bottom-3"
        >
          {t('emptyState.copy')}
          <Trans
            i18nKey="tasks:emptyState.viewCompletedTasks"
            components={{
              link1: <UswdsReactLink to="#" className="deep-underline" />
            }}
          />
        </Alert>
        <div className="display-flex flex-justify-end">
          <Button
            type="button"
            unstyled
            className="deep-underline"
            onClick={() => {
              // TODO: navigate to "See all tasks" page when built
              navigate(`/models/${modelID}/collaboration-area`);
            }}
          >
            {t('seeAllTasks')}
          </Button>
        </div>
      </>
    );
  }

  const currentTask = orderedTasks[currentIndex];
  const currentTaskKey = currentTask.key;
  const taskStatus = currentTask.status;
  const taskState = currentTask.state;
  const baseKey = `${currentTaskKey}.${taskStatus}`;
  const lastEditSection = getLastEditSectionForTask(currentTaskKey);

  return (
    <div>
      <h2 className="margin-top-0">{t('heading')}</h2>
      <CardGroup>
        <Card
          gridLayout={{ desktop: { col: 12 } }}
          className="collaboration-area__card minh-0 margin-bottom-3"
        >
          <CardHeader>
            <div className="display-flex flex-align-center flex-justify">
              <h3 className="usa-card__heading">{t(`${baseKey}.heading`)}</h3>
              <StateTag state={taskState} />
            </div>
          </CardHeader>
          <CardBody>
            <p>{t(`${currentTaskKey}.copy`)}</p>

            {/* Only show section details if task is not TO_DO */}
            {taskStatus !== PlanTaskStatus.TO_DO && (
              <div className="display-flex flex-align-center flex-wrap-wrap">
                {currentTaskKey === PlanTaskKey.MODEL_PLAN && (
                  <>
                    <span className="text-base">
                      {collaborationAreaT('modelPlanCard.sectionsStarted', {
                        sectionsStarted: sectionStartedCounter
                      })}
                    </span>
                    <span className="text-base margin-x-2">|</span>
                  </>
                )}
                {lastEditSection && (
                  <LastModifiedSection section={lastEditSection} />
                )}
              </div>
            )}
          </CardBody>
          <CardFooter className="display-flex border-top-0 padding-top-1">
            <Button
              type="button"
              className="margin-right-2"
              onClick={() =>
                navigate(t(`${currentTaskKey}.primaryPath`, { modelID }))
              }
            >
              {t(`${baseKey}.primaryAction`)}
            </Button>
            <Button
              type="button"
              outline
              onClick={() => navigate(t(`${currentTaskKey}.secondaryPath`))}
            >
              {t(`${currentTaskKey}.secondaryAction`)}
            </Button>
          </CardFooter>
        </Card>
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
              // TODO: navigate to "See all tasks" page when built
              navigate(`/models/${modelID}/collaboration-area`);
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
