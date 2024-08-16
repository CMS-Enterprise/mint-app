import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import { TaskStatus } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';

import './index.scss';

type ModelPlanCardType = {
  modelID: string;
  modifiedDts?: string;
  modifiedBy?: string;
};

const ModelPlanCard = ({
  modelID,
  modifiedDts,
  modifiedBy
}: ModelPlanCardType) => {
  const { t: modelPlanCardT } = useTranslation('modelPlanCard');

  return (
    <Card gridLayout={{ tablet: { col: 6 } }} className="card--model-plan">
      <CardHeader>
        <h3 className="usa-card__heading">{modelPlanCardT('heading')}</h3>
      </CardHeader>
      <div className="card__section-status">
        <TaskListStatusTag
          status={TaskStatus.READY}
          classname="width-fit-content"
        />
        <span className="text-base">
          {modelPlanCardT('sectionsStarted', {
            sectionsStarted: 1,
            totalSections: 7
          })}
        </span>
      </div>

      <CardBody>
        <p>{modelPlanCardT('body')}</p>
      </CardBody>
      <CardFooter>
        <UswdsReactLink
          to={`/models/${modelID}/task-list`}
          className="usa-button"
          variant="unstyled"
        >
          {modelPlanCardT('button.goToModelPlan')}
        </UswdsReactLink>
      </CardFooter>
    </Card>
  );
};

export default ModelPlanCard;
