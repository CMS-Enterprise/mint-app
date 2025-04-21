import React, { useState } from 'react';
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
import Modal from 'components/Modal';
import ShareExportModal from 'components/ShareExport';
import useSectionLock from 'hooks/useSectionLock';
import { formatDateLocal } from 'utils/date';

export type MtoCardProps = {
  modelID: string;
  mtoMatrix: GetModelPlanQuery['modelPlan']['mtoMatrix'];
};

const MTOCard = ({ modelID, mtoMatrix }: MtoCardProps) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const history = useHistory();

  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const { SectionLock, isLocked } = useSectionLock({
    section: LockableSection.MODELS_TO_OPERATION_MATRIX
  });

  const { status, recentEdit, milestones } = mtoMatrix;
  const { actorName, date } = recentEdit || {};

  return (
    <>
      <Modal
        isOpen={isExportModalOpen}
        closeModal={() => setIsExportModalOpen(false)}
        className="padding-0 radius-md share-export-modal__container"
        navigation
        shouldCloseOnOverlayClick
      >
        <ShareExportModal
          closeModal={() => setIsExportModalOpen(false)}
          modelID={modelID}
          setStatusMessage={() => null}
        />
      </Modal>
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
          {status !== 'READY' && (
            <span className="text-base">
              {collaborationAreaT('mtoCard.modelMilestonesAdded', {
                count: milestones.length
              })}
            </span>
          )}
        </div>
        <CardBody>
          <p>{collaborationAreaT('mtoCard.body')}</p>

          {date && actorName && !isLocked && (
            <div className="display-inline tablet:display-flex margin-top-2 margin-bottom-3 flex-align-center">
              <span className="text-base margin-right-1">
                {collaborationAreaT('dataExchangeApproachCard.lastModified', {
                  date: formatDateLocal(date, 'MM/dd/yyyy')
                })}
              </span>
              <Avatar className="text-base-darkest" user={actorName} />
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
                `/models/${modelID}/collaboration-area/model-to-operations`
              )
            }
            data-testid="to-model-to-operations"
          >
            {collaborationAreaT('mtoCard.goToMatrix')}
          </Button>

          {status !== 'READY' && (
            <Button
              type="button"
              outline
              onClick={() => setIsExportModalOpen(true)}
              data-testid="to-model-to-operations"
            >
              {collaborationAreaT('mtoCard.shareOrExport')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default MTOCard;
