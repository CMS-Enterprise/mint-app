import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import { TaskStatus, useGetModelPlanQuery } from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import { Avatar } from 'components/shared/Avatar';
import ShareExportModal from 'components/ShareExport';
import Spinner from 'components/Spinner';
import { formatDateLocal } from 'utils/date';
import { StatusMessageType } from 'views/ModelPlan/TaskList';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';

import './index.scss';

type ModelPlanCardType = {
  modelID: string;
  setStatusMessage: (message: StatusMessageType) => void;
};

const ModelPlanCard = ({ modelID, setStatusMessage }: ModelPlanCardType) => {
  const { t: collaborationAreaT } = useTranslation('collaborationArea');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const { data, loading } = useGetModelPlanQuery({
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan;

  // Returns the number of sections that have been started (i.e. not in 'READY' status)
  const sectionStartedCounter = useMemo(() => {
    if (loading || !modelPlan) return 0;

    const sections = [
      modelPlan.basics.status,
      modelPlan.generalCharacteristics.status,
      modelPlan.participantsAndProviders.status,
      modelPlan.beneficiaries.status,
      modelPlan.opsEvalAndLearning.status,
      modelPlan.payments.status,
      modelPlan.opSolutionLastModifiedDts === ''
        ? TaskStatus.READY
        : TaskStatus.IN_PROGRESS
    ];

    return sections.filter(status => status !== TaskStatus.READY).length;
  }, [loading, modelPlan]);

  if (loading)
    return (
      <li className="grid-col-6 padding-x-1">
        <Spinner className="" />
      </li>
    );

  if (!modelPlan) return null;

  const { modifiedDts, modifiedByUserAccount, taskListStatus } = modelPlan;

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
      <Card gridLayout={{ desktop: { col: 6 } }} className="card--model-plan">
        <CardHeader>
          <h3 className="usa-card__heading">
            {collaborationAreaT('modelPlanCard.heading')}
          </h3>
        </CardHeader>
        <div className="card__section-status">
          <TaskListStatusTag
            status={taskListStatus}
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

        {modifiedDts && modifiedByUserAccount && (
          <div className="display-inline tablet:display-flex margin-top-2 margin-bottom-3 flex-align-center padding-x-3">
            <span className="text-base margin-right-1">
              {collaborationAreaT('modelPlanCard.mostRecentEdit', {
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
            to={`/models/${modelID}/task-list`}
            className="usa-button"
            variant="unstyled"
            data-testid="to-task-list"
          >
            {collaborationAreaT('goToModelPlan')}
          </UswdsReactLink>
          {sectionStartedCounter !== 0 && (
            <Button
              type="button"
              className="usa-button usa-button--outline"
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
