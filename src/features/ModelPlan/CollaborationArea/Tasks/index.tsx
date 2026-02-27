import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import {
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus
} from 'gql/generated/graphql';

const StateTag = ({ state }: { state: PlanTaskState }) => {
  const { t } = useTranslation('tasks');

  let tagStyle;
  let tagCopy;

  switch (state) {
    case PlanTaskState.TO_DO:
      tagCopy = t('state.TO_DO');
      tagStyle = 'bg-warning-light';
      break;
    case PlanTaskState.COMPLETE:
      tagCopy = t('state.COMPLETE');
      tagStyle = 'bg-success-dark text-white';
      break;
    default:
      tagCopy = '';
      tagStyle = 'bg-info-light';
  }

  return (
    <div
      data-testid="tasklist-tag"
      className={`model-plan-task-list__task-tag line-height-body-1 text-bold ${tagStyle}`}
    >
      <Icon.PriorityHigh className="margin-right-1" />
      <span>{tagCopy}</span>
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
              <StateTag state={PlanTaskState.COMPLETE} />
            </div>
          </CardHeader>
          <CardBody>
            <p>{t(`${modelPlanBaseKey}.copy`)}</p>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
};

export default TasksWrapper;
