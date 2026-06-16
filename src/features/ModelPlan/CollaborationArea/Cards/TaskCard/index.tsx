import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import {
  GetCollaborationAreaQuery,
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus
} from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';

import LastModifiedSection from '../../_components/LastModifiedSection';
import {
  getLastEditSectionForTask,
  getSectionStartedCount
} from '../../_utils/modelPlanSectionUtils';

type TaskCardProps = {
  task: GetCollaborationAreaQuery['modelPlan']['tasks'][number];
  modelPlan: GetCollaborationAreaQuery['modelPlan'];
};

type TaskStateConfig = {
  style: string;
  icon: React.ReactNode;
};

const TASK_STATE_CONFIG: Record<PlanTaskState, TaskStateConfig> = {
  [PlanTaskState.TO_DO]: {
    style: 'bg-warning-light',
    icon: <Icon.PriorityHigh aria-label="To do" />
  },
  [PlanTaskState.COMPLETE]: {
    style: 'bg-success-dark text-white',
    icon: <Icon.Check aria-label="Complete" />
  }
};

function TaskStateTag({ state }: { state: PlanTaskState }) {
  const { t } = useTranslation('tasks');
  const { style, icon } = TASK_STATE_CONFIG[state];

  return (
    <div
      className={`line-height-body-1 text-bold display-flex flex-align-center ${style}`}
      style={{ padding: '7px 11px', gap: '0.5rem' }}
    >
      {icon}
      <span>{t(`state.${state}`)}</span>
    </div>
  );
}

const TaskCard = ({ task, modelPlan }: TaskCardProps) => {
  const { t } = useTranslation('tasks');
  const { t: collaborationAreaT } = useTranslation('collaborationArea');
  const navigate = useNavigate();
  const { modelID = '' } = useParams<{ modelID: string }>();

  const { key, status, state } = task;
  const baseKey = `${key}.${status}`;
  const lastEditSection = getLastEditSectionForTask(key, modelPlan);
  const sectionStartedCounter = getSectionStartedCount(modelPlan);

  return (
    <Card
      gridLayout={{ desktop: { col: 12 } }}
      className="collaboration-area__card minh-0 margin-bottom-3"
    >
      <CardHeader>
        <div className="display-flex flex-align-center flex-justify">
          <h3 className="usa-card__heading">{t(`${baseKey}.heading`)}</h3>
          <TaskStateTag state={state} />
        </div>
      </CardHeader>

      <CardBody>
        <p>{t(`${key}.copy`)}</p>

        {status !== PlanTaskStatus.TO_DO && (
          <div className="display-flex flex-align-center flex-wrap-wrap">
            {key === PlanTaskKey.MODEL_PLAN && (
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
          onClick={() => navigate(t(`${key}.primaryPath`, { modelID }))}
        >
          {t(`${baseKey}.primaryAction`)}
        </Button>
        <UswdsReactLink
          to={t(`${key}.secondaryPath`)}
          target="_blank"
          rel="noopener noreferrer"
          className="usa-button usa-button--outline"
          variant="unstyled"
        >
          {t(`${key}.secondaryAction`)}
        </UswdsReactLink>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
