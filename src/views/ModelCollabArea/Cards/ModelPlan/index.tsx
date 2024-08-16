import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';

import './index.scss';

const ModelPlanCard = () => {
  const { t: modelPlanCardT } = useTranslation('modelPlanCard');

  return (
    <Card gridLayout={{ tablet: { col: 6 } }} className="card--model-plan">
      <CardHeader>
        <h3 className="usa-card__heading">{modelPlanCardT('heading')}</h3>
      </CardHeader>
      <CardBody>
        <p>{modelPlanCardT('body')}</p>
      </CardBody>
      <CardFooter>
        <UswdsReactLink
          to="/model-plan"
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
