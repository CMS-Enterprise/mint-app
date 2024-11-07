import React from 'react';
import { useTranslation } from 'react-i18next';
import {
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

type MTOMatrixType = GetModelPlanQuery['modelPlan']['mtoMatrix'];

const MTOCard = ({
  modelID,
  mtoMatrix
}: {
  modelID: string;
  mtoMatrix: MTOMatrixType;
}) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const { SectionLock, isLocked } = useSectionLock({
    section: LockableSection.MODELS_TO_OPERATION_MATRIX
  });

  const { recentEdit, status } = mtoMatrix;

  // const { modifiedDts, modifiedByUserAccount } = recentEdit;

  return (
    <Card
      gridLayout={{ desktop: { col: 6 } }}
      className="collaboration-area__card collaboration-area__main-card"
    >
      <CardHeader>
        <h3 className="usa-card__heading">
          {collaborationAreaT('mtoCard.heading')}
        </h3>
      </CardHeader>
      <div className="collaboration-area__status flex-align-center">
        <TaskListStatusTag status={status} classname="width-fit-content" />
        <span className="text-base">
          {collaborationAreaT('mtoCard.modelMilestonesAdded', {
            count: 0
          })}
        </span>
      </div>
      <CardBody>
        <p>{collaborationAreaT('mtoCard.body')}</p>

        {recentEdit?.modifiedDts &&
          recentEdit?.modifiedByUserAccount &&
          !isLocked && (
            <div className="display-inline tablet:display-flex margin-top-2 margin-bottom-3 flex-align-center">
              <span className="text-base margin-right-1">
                {collaborationAreaT('mtoCard.lastModified', {
                  date: formatDateLocal(recentEdit?.modifiedDts, 'MM/dd/yyyy')
                })}
              </span>
              <Avatar
                className="text-base-darkest"
                user={recentEdit?.modifiedByUserAccount.commonName}
              />
            </div>
          )}

        <SectionLock />
      </CardBody>
      <CardFooter>
        <UswdsReactLink
          to={`/models/${modelID}/collaboration-area/`}
          className="usa-button"
          variant="unstyled"
          data-testid="go-to-the-matrix"
        >
          {collaborationAreaT('mtoCard.goToMatrix')}
        </UswdsReactLink>
        <UswdsReactLink
          to={`/models/${modelID}/collaboration-area/`}
          className="usa-button usa-button--outline margin-left-0"
          variant="unstyled"
          data-testid="manage-collaborators"
        >
          {collaborationAreaT('mtoCard.shareOrExport')}
        </UswdsReactLink>
      </CardFooter>
    </Card>
  );
};

export default MTOCard;
