import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid
} from '@trussworks/react-uswds';
import {
  getITSolutionsStatus,
  StatusMessageType
} from 'features/ModelPlan/TaskList';
import { TaskListStatusTag } from 'features/ModelPlan/TaskList/_components/TaskListItem';
import { TaskStatus, useGetModelPlanQuery } from 'gql/generated/graphql';

import { Avatar } from 'components/Avatar';
import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import ShareExportModal from 'components/ShareExport';
import Spinner from 'components/Spinner';
import { formatDateLocal } from 'utils/date';

// importing global card styles from Cards/cards.scss
import '../cards.scss';

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
      getITSolutionsStatus(modelPlan.operationalNeeds)
    ];

    return sections.filter(status => status !== TaskStatus.READY).length;
  }, [loading, modelPlan]);

  if (loading && !modelPlan)
    return (
      <Grid
        desktop={{ col: 6 }}
        className="padding-1 display-flex flex-column flex-align-center flex-justify-center height-mobile"
      >
        <Spinner />
      </Grid>
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

          {modifiedDts && modifiedByUserAccount && (
            <div className="display-inline tablet:display-flex margin-top-2 margin-bottom-3 flex-align-center">
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
        </CardBody>

        <CardFooter>
          <UswdsReactLink
            to={`/models/${modelID}/task-list`}
            className="usa-button margin-right-1"
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
