import React from 'react';
import { useTranslation } from 'react-i18next';
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
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus
} from 'gql/generated/graphql';

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

const TasksWrapper = () => {
  const { t } = useTranslation('tasks');

  const modelPlanKey = PlanTaskKey.MODEL_PLAN;
  const modelPlanBaseKey = `${modelPlanKey}.${PlanTaskStatus.TO_DO}`;

  return (
    <div>
      <h2 className="margin-top-0">{t('heading')}</h2>
      <CardGroup>
        <Card
          gridLayout={{ desktop: { col: 12 } }}
          className="collaboration-area__card  minh-0"
          key={modelPlanKey}
        >
          <CardHeader>
            <div className="display-flex flex-align-center flex-justify">
              <h3 className="usa-card__heading">
                {t(`${modelPlanBaseKey}.heading`)}
              </h3>
              <StateTag state={PlanTaskState.TO_DO} />
            </div>
          </CardHeader>
          <CardBody>
            <p>{t(`${modelPlanBaseKey}.copy`)}</p>
          </CardBody>
          <CardFooter className="display-flex  border-top-0">
            <Button type="button" className="margin-right-1">
              {t(`${modelPlanBaseKey}.primaryAction`)}
            </Button>
            <Button type="button" outline>
              {t(`${modelPlanBaseKey}.secondaryAction`)}
            </Button>
          </CardFooter>
        </Card>
      </CardGroup>
    </div>
  );
};

export default TasksWrapper;
