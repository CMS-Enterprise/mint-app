import React from 'react';
import { useTranslation } from 'react-i18next';
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
  PlanTask,
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus
} from 'gql/generated/graphql';

import type { LastModifiedSectionData } from '../_components/LastModifiedSection';
import LastModifiedSection from '../_components/LastModifiedSection';
import {
  getLastModifiedSection,
  getSectionStartedCount
} from '../_utils/modelPlanSectionUtils';

type StateConfig = {
  style: string;
  icon: React.ReactNode;
  copy: string;
};

const STATE_CONFIG: Record<PlanTaskState, StateConfig> = {
  [PlanTaskState.TO_DO]: {
    style: 'bg-warning-light',
    icon: <Icon.PriorityHigh />,
    copy: 'state.TO_DO'
  },
  [PlanTaskState.COMPLETE]: {
    style: 'bg-success-dark text-white',
    icon: <Icon.Check />,
    copy: 'state.COMPLETE'
  }
};

const StateTag = ({ state }: { state: PlanTaskState }) => {
  const { t } = useTranslation('tasks');

  const { style, icon, copy } = STATE_CONFIG[state];

  return (
    <div
      className={`line-height-body-1 text-bold display-flex flex-align-center ${style}`}
      style={{ padding: '7px 11px', gap: '0.5rem' }}
    >
      {icon}
      <span>{t(copy)}</span>
    </div>
  );
};

// TEMP
const TASK_KEY_ORDER: PlanTaskKey[] = [
  PlanTaskKey.MODEL_PLAN,
  PlanTaskKey.DATA_EXCHANGE,
  PlanTaskKey.MTO
];

export type TasksByKey = Record<
  PlanTaskKey,
  Pick<PlanTask, 'key' | 'state' | 'status'>
>;

// TEMP
export const MOCK_TASKS_BY_KEY: TasksByKey = {
  [PlanTaskKey.MODEL_PLAN]: {
    key: PlanTaskKey.MODEL_PLAN,
    state: PlanTaskState.TO_DO,
    status: PlanTaskStatus.TO_DO
  },
  [PlanTaskKey.DATA_EXCHANGE]: {
    key: PlanTaskKey.DATA_EXCHANGE,
    state: PlanTaskState.COMPLETE,
    status: PlanTaskStatus.COMPLETE
  },
  [PlanTaskKey.MTO]: {
    key: PlanTaskKey.MTO,
    state: PlanTaskState.TO_DO,
    status: PlanTaskStatus.IN_PROGRESS
  }
};

type TasksWrapperProps = {
  modelPlan: GetCollaborationAreaQuery['modelPlan'];
  tasksByKey: TasksByKey;
};

const TasksWrapper = ({ modelPlan, tasksByKey }: TasksWrapperProps) => {
  const { t } = useTranslation('tasks');
  const { t: collaborationAreaT } = useTranslation('collaborationArea');
  const { modelID = '' } = useParams<{ modelID: string }>();
  const navigate = useNavigate();

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
      const { modifiedDts, modifiedByUserAccount } =
        modelPlan?.dataExchangeApproach ?? {};
      if (modifiedDts && modifiedByUserAccount) {
        return {
          modifiedDts,
          modifiedByUserAccount: {
            commonName: modifiedByUserAccount.commonName
          }
        };
      }
      return null;
    }
    return null;
  }

  return (
    <div>
      <h2 className="margin-top-0">{t('heading')}</h2>
      <CardGroup>
        {TASK_KEY_ORDER.map(taskKey => {
          const task = tasksByKey[taskKey];
          const taskStatus = task.status;
          const taskState = task.state;
          const baseKey = `${taskKey}.${taskStatus}`;

          const lastEditSection = getLastEditSectionForTask(taskKey);
          const showSectionDetails = taskStatus !== PlanTaskStatus.TO_DO;

          return (
            <Card
              key={taskKey}
              gridLayout={{ desktop: { col: 12 } }}
              className="collaboration-area__card minh-0"
            >
              <CardHeader>
                <div className="display-flex flex-align-center flex-justify">
                  <h3 className="usa-card__heading">
                    {t(`${baseKey}.heading`)}
                  </h3>
                  <StateTag state={taskState} />
                </div>
              </CardHeader>
              <CardBody>
                <p>{t(`${taskKey}.copy`)}</p>
                {showSectionDetails && (
                  <div className="display-flex flex-align-center flex-wrap-wrap">
                    {taskKey === PlanTaskKey.MODEL_PLAN && (
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
              <CardFooter className="display-flex border-top-0">
                <Button
                  type="button"
                  className="margin-right-1"
                  onClick={() =>
                    navigate(t(`${taskKey}.primaryPath`, { modelID }))
                  }
                >
                  {t(`${baseKey}.primaryAction`)}
                </Button>
                <Button
                  type="button"
                  outline
                  onClick={() => navigate(t(`${taskKey}.secondaryPath`))}
                >
                  {t(`${taskKey}.secondaryAction`)}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </CardGroup>
    </div>
  );
};

export default TasksWrapper;
