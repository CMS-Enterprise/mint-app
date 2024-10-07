import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import { GetModelPlanQuery, LockableSection } from 'gql/generated/graphql';

import { Avatar } from 'components/Avatar';
import UswdsReactLink from 'components/LinkWrapper';
import useSectionLock from 'hooks/useSectionLock';
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

  const history = useHistory();

  const { modifiedDts, modifiedByUserAccount, status } =
    dataExhangeApproachData;

  const { SectionLock, isLocked } = useSectionLock({
    section: LockableSection.DATA_EXCHANGE_APPROACH
  });

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

          {modifiedDts && modifiedByUserAccount && !isLocked && (
            <div className="display-inline tablet:display-flex margin-top-2 margin-bottom-3 flex-align-center">
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

          <SectionLock />
        </CardBody>

        <CardFooter>
          <Button
            type="button"
            className="margin-right-2"
            disabled={isLocked}
            onClick={() =>
              history.push(
                `/models/${modelID}/collaboration-area/data-exchange-approach`
              )
            }
            data-testid="to-data-exchange-approach"
          >
            {modifiedDts
              ? collaborationAreaT('dataExchangeApproachCard.editApproach')
              : collaborationAreaT('dataExchangeApproachCard.startApproach')}
          </Button>

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
