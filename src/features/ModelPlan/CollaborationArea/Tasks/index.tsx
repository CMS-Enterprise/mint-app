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

const TASK_KEY_ORDER: PlanTaskKey[] = [
  PlanTaskKey.MODEL_PLAN,
  PlanTaskKey.DATA_EXCHANGE,
  PlanTaskKey.MTO
];

const SUPPORTED_STATUSES: PlanTaskStatus[] = [
  PlanTaskStatus.TO_DO,
  PlanTaskStatus.IN_PROGRESS,
  PlanTaskStatus.COMPLETE
];

function getTaskStatus(task: PlanTask | undefined): PlanTaskStatus {
  const status = task?.status ?? PlanTaskStatus.TO_DO;
  return SUPPORTED_STATUSES.includes(status) ? status : PlanTaskStatus.TO_DO;
}

function getTaskState(task: PlanTask | undefined): PlanTaskState {
  return task?.state ?? PlanTaskState.TO_DO;
}

type TasksWrapperProps = {
  modelPlan: GetCollaborationAreaQuery['modelPlan'];
  tasksByKey: Partial<Record<PlanTaskKey, PlanTask>>;
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
      const de = modelPlan?.dataExchangeApproach;
      if (de?.modifiedDts && de?.modifiedByUserAccount) {
        return {
          modifiedDts: de.modifiedDts,
          modifiedByUserAccount: {
            commonName: de.modifiedByUserAccount.commonName
          }
        };
      }
      return null;
    }
    return null;
  }

  const getPrimaryNavigate = (taskKey: PlanTaskKey) => {
    switch (taskKey) {
      case PlanTaskKey.MODEL_PLAN:
        return () =>
          navigate(`/models/${modelID}/collaboration-area/model-plan`);
      case PlanTaskKey.DATA_EXCHANGE:
        return () =>
          navigate(
            `/models/${modelID}/collaboration-area/data-exchange-approach/about-completing-data-exchange`
          );
      case PlanTaskKey.MTO:
        return () =>
          navigate(
            `/models/${modelID}/collaboration-area/model-to-operations`,
            { state: { scroll: true } }
          );
      default:
        return () => {};
    }
  };

  const getSecondaryNavigate = (taskKey: PlanTaskKey) => {
    switch (taskKey) {
      case PlanTaskKey.MODEL_PLAN:
        return () => navigate(`/help-and-knowledge/sample-model-plan`);
      case PlanTaskKey.DATA_EXCHANGE:
        return () =>
          navigate(`/help-and-knowledge/evaluating-data-exchange-approach`);
      case PlanTaskKey.MTO:
        return () => navigate(`/help-and-knowledge/creating-mto-matrix`);
      default:
        return () => {};
    }
  };

  return (
    <div>
      <h2 className="margin-top-0">{t('heading')}</h2>
      <CardGroup>
        {TASK_KEY_ORDER.map(taskKey => {
          const task = tasksByKey[taskKey];
          const taskStatus = getTaskStatus(task);
          const taskState = getTaskState(task);
          const baseKey = `${taskKey}.${taskStatus}`;

          const showModelPlanSectionDetails =
            taskKey === PlanTaskKey.MODEL_PLAN &&
            taskStatus !== PlanTaskStatus.TO_DO;
          const showLastEditOnly =
            (taskKey === PlanTaskKey.MTO ||
              taskKey === PlanTaskKey.DATA_EXCHANGE) &&
            taskStatus !== PlanTaskStatus.TO_DO;
          const lastEditSection = getLastEditSectionForTask(taskKey);

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
                {showModelPlanSectionDetails && (
                  <div className="display-flex flex-align-center flex-wrap-wrap">
                    <span className="text-base">
                      {collaborationAreaT('modelPlanCard.sectionsStarted', {
                        sectionsStarted: sectionStartedCounter
                      })}
                    </span>
                    {lastModifiedSection?.modifiedDts && (
                      <>
                        <span className="text-base margin-x-2">|</span>
                        <LastModifiedSection section={lastModifiedSection} />
                      </>
                    )}
                  </div>
                )}
                {showLastEditOnly && lastEditSection && (
                  <div className="display-flex flex-align-center flex-wrap-wrap">
                    <LastModifiedSection
                      section={lastEditSection}
                      translationKey={
                        taskKey === PlanTaskKey.DATA_EXCHANGE
                          ? 'dataExchangeApproachCard.lastModified'
                          : undefined
                      }
                    />
                  </div>
                )}
              </CardBody>
              <CardFooter className="display-flex border-top-0">
                <Button
                  type="button"
                  className="margin-right-1"
                  onClick={getPrimaryNavigate(taskKey)}
                >
                  {t(`${baseKey}.primaryAction`)}
                </Button>
                <Button
                  type="button"
                  outline
                  onClick={getSecondaryNavigate(taskKey)}
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
