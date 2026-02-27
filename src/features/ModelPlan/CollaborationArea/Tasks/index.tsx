import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardGroup, CardHeader } from '@trussworks/react-uswds';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import {
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus
} from 'gql/generated/graphql';

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
              <TaskListStatusTag status={PlanTaskState.TO_DO} />
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
