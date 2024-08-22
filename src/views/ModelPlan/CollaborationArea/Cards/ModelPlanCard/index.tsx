import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';
import {
  GetModelPlanQuery,
  ModelStatus,
  PrepareForClearanceStatus,
  TaskStatus,
  useGetModelPlanQuery
} from 'gql/gen/graphql';

import UswdsReactLink from 'components/LinkWrapper';
import Modal from 'components/Modal';
import { Avatar } from 'components/shared/Avatar';
import ShareExportModal from 'components/ShareExport';
import Spinner from 'components/Spinner';
import { formatDateLocal } from 'utils/date';
import { StatusMessageType } from 'views/ModelPlan/TaskList';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';

import './index.scss';

type GetModelPlanTypes = GetModelPlanQuery['modelPlan'];
type OperationalNeedsType = GetModelPlanQuery['modelPlan']['operationalNeeds'][0];

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

  const modelPlan =
    data?.modelPlan ||
    ({
      __typename: 'ModelPlan',
      id: modelID,
      modelName: 'Test',
      archived: false,
      status: ModelStatus.PLAN_DRAFT,
      modifiedDts: '',
      modifiedByUserAccount: {
        __typename: 'UserAccount',
        commonName: ''
      },
      basics: {
        __typename: 'PlanBasics',
        id: '123',
        status: TaskStatus.READY
      },
      generalCharacteristics: {
        __typename: 'PlanGeneralCharacteristics',
        id: '54234',
        createdBy: 'John Doe',
        createdDts: '',
        modifiedBy: '',
        modifiedDts: '',
        readyForClearanceDts: '',
        status: TaskStatus.IN_PROGRESS
      },
      participantsAndProviders: {
        __typename: 'PlanParticipantsAndProviders',
        id: '46246356',
        createdBy: 'John Doe',
        createdDts: '',
        modifiedBy: '',
        modifiedDts: '',
        readyForClearanceDts: '',
        status: TaskStatus.IN_PROGRESS
      },
      beneficiaries: {
        __typename: 'PlanBeneficiaries',
        id: '09865643',
        createdBy: 'John Doe',
        createdDts: '',
        modifiedBy: '',
        modifiedDts: '',
        readyForClearanceDts: '',
        status: TaskStatus.IN_PROGRESS
      },
      opsEvalAndLearning: {
        __typename: 'PlanOpsEvalAndLearning',
        id: '7865676',
        createdBy: 'John Doe',
        createdDts: '',
        modifiedBy: '',
        modifiedDts: '',
        readyForClearanceDts: '',
        status: TaskStatus.IN_PROGRESS
      },
      payments: {
        __typename: 'PlanPayments',
        id: '8756435235',
        createdBy: 'John Doe',
        createdDts: '',
        modifiedBy: '',
        modifiedDts: '',
        readyForClearanceDts: '',
        status: TaskStatus.IN_PROGRESS
      },
      operationalNeeds: [],
      taskListStatus: TaskStatus.READY,
      isFavorite: true,
      collaborators: [],
      documents: [],
      crs: [],
      tdls: [],
      discussions: [],
      prepareForClearance: {
        __typename: 'PrepareForClearance',
        status: PrepareForClearanceStatus.IN_PROGRESS,
        modifiedDts: ''
      }
    } as GetModelPlanTypes);

  const {
    modifiedDts,
    modifiedByUserAccount,
    basics,
    generalCharacteristics,
    participantsAndProviders,
    beneficiaries,
    opsEvalAndLearning,
    payments,
    operationalNeeds = [],
    taskListStatus
  } = modelPlan;

  const getITSolutionsStatus = (
    operationalNeedsArray: OperationalNeedsType[]
  ) => {
    const inProgress = operationalNeedsArray.find(need => need.modifiedDts);
    return inProgress ? TaskStatus.IN_PROGRESS : TaskStatus.READY;
  };

  // Returns the number of sections that have been started (i.e. not in 'READY' status)
  const sectionStartedCounter = useMemo(() => {
    if (loading) return 0;

    const sections = [
      basics.status,
      generalCharacteristics.status,
      participantsAndProviders.status,
      beneficiaries.status,
      opsEvalAndLearning.status,
      payments.status,
      getITSolutionsStatus(operationalNeeds)
    ];

    return sections.filter(status => status !== TaskStatus.READY).length;
  }, [
    loading,
    basics?.status,
    generalCharacteristics?.status,
    participantsAndProviders?.status,
    beneficiaries?.status,
    opsEvalAndLearning?.status,
    payments?.status,
    operationalNeeds
  ]);

  if (loading) return <Spinner />;

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
          <div className="display-flex margin-top-2 margin-bottom-3 flex-align-center">
            <span className="text-base margin-left-3 margin-right-1">
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
              className="usa-button usa-button--outline margin-left-1"
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
