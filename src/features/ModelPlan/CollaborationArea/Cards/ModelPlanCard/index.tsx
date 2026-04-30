import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import { StatusMessageType } from 'features/ModelPlan/TaskList';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import { GetCollaborationAreaQuery } from 'gql/generated/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import ShareExportModal from 'components/ShareExport';

import LastModifiedSection from '../../_components/LastModifiedSection';
import {
  getLastModifiedSection,
  getSectionStartedCount
} from '../../_utils/modelPlanSectionUtils';

// importing global card styles from Cards/cards.scss
import '../cards.scss';

type ModelPlanCardType = {
  modelID: string;
  modelPlan: GetCollaborationAreaQuery['modelPlan'];
  setStatusMessage: (message: StatusMessageType) => void;
};

const ModelPlanCard = ({
  modelID,
  modelPlan,
  setStatusMessage
}: ModelPlanCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const lastModifiedSection = getLastModifiedSection(modelPlan);
  const sectionStartedCounter = getSectionStartedCount(modelPlan);

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
          setStatusMessage={setStatusMessage}
        />
      </Modal>
      <Card
        gridLayout={{ desktop: { col: 6 } }}
        className="collaboration-area__card collaboration-area__main-card"
      >
        <CardHeader>
          <h3 className="usa-card__heading">
            {collaborationAreaT('modelPlanCard.heading')}
          </h3>
        </CardHeader>
        <div className="collaboration-area__status flex-align-center">
          <TaskListStatusTag
            status={modelPlan.taskListStatus}
            classname="width-fit-content"
          />
          <span className="text-base">
            {collaborationAreaT('modelPlanCard.sectionsStarted', {
              sectionsStarted: sectionStartedCounter
            })}
          </span>
        </div>

        <CardBody>
          <p>{collaborationAreaT('modelPlanCard.body')}</p>
        </CardBody>

        {lastModifiedSection?.modifiedDts && (
          <div className="margin-top-2 margin-bottom-3 padding-x-3">
            <LastModifiedSection section={lastModifiedSection} />
          </div>
        )}
        <CardFooter>
          <UswdsReactLink
            to={`/models/${modelID}/collaboration-area/model-plan`}
            className="usa-button margin-right-1"
            variant="unstyled"
            data-testid="to-model-plan"
          >
            {collaborationAreaT('goToModelPlan')}
          </UswdsReactLink>
          {sectionStartedCounter !== 0 && (
            <Button
              type="button"
              className="usa-button usa-button--outline"
              data-testid="share-export-button"
              onClick={() => setIsExportModalOpen(true)}
            >
              {collaborationAreaT('modelPlanCard.shareButton')}
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default ModelPlanCard;
