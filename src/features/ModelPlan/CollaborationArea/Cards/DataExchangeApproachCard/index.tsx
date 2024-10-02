import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import { GetModelPlanQuery } from 'gql/generated/graphql';

import { Avatar } from 'components/Avatar';
import UswdsReactLink from 'components/LinkWrapper';
import { formatDateLocal } from 'utils/date';

import '../cards.scss';

export type DataExchangeApproachType =
  GetModelPlanQuery['modelPlan']['dataExchangeApproach'];

type DataExchangeApproachCardType = {
  modelID: string;
  dataExhangeApproachData: DataExchangeApproachType;
};

const DataExchangeApproachCard = ({
  modelID,
  dataExhangeApproachData
}: DataExchangeApproachCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const { modifiedDts, modifiedByUserAccount, status } =
    dataExhangeApproachData;

  return (
    <>
      <Card
        gridLayout={{ desktop: { col: 6 } }}
        className="collaboration-area__card collaboration-area__main-card"
      >
        <CardHeader>
          <h3 className="usa-card__heading">
            {collaborationAreaT('dataExchangeApproachCard.heading')}
          </h3>
        </CardHeader>
        <div className="collaboration-area__status flex-align-center">
          <TaskListStatusTag status={status} classname="width-fit-content" />
        </div>

        <CardBody>
          <p>{collaborationAreaT('dataExchangeApproachCard.body')}</p>
        </CardBody>

        {modifiedDts && modifiedByUserAccount && (
          <div className="display-inline tablet:display-flex margin-top-2 margin-bottom-3 flex-align-center padding-x-3">
            <span className="text-base margin-right-1">
              {collaborationAreaT('dataExchangeApproachCard.lastModified', {
                date: formatDateLocal(modifiedDts, 'MM/dd/yyyy')
              })}
            </span>
            <Avatar
              className="text-base-darkest"
              user={modifiedByUserAccount.commonName}
            />
          </div>
        )}

        <CardFooter>
          <UswdsReactLink
            to={`/models/${modelID}/data-exchange-approach/about-completing-data-exchange-approach`}
            className="usa-button margin-right-2"
            variant="unstyled"
            data-testid="to-data-exchange-approach"
          >
            {modifiedDts
              ? collaborationAreaT('dataExchangeApproachCard.editApproach')
              : collaborationAreaT('dataExchangeApproachCard.startApproach')}
          </UswdsReactLink>

          <UswdsReactLink
            variant="external"
            target="_blank"
            data-testid="view-data-exchange-help-article"
            to="/help-and-knowledge/evaluating-data-exchange-approach"
          >
            {collaborationAreaT('dataExchangeApproachCard.viewHelpArticle')}
          </UswdsReactLink>
        </CardFooter>
      </Card>
    </>
  );
};

export default DataExchangeApproachCard;
