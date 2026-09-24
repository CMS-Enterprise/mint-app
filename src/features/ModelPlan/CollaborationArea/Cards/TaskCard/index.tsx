import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  Link
} from '@trussworks/react-uswds';
import {
  DocumentType,
  GetCollaborationAreaDocument,
  GetCollaborationAreaQuery,
  PlanTaskKey,
  PlanTaskState,
  PlanTaskStatus,
  useUpdateTaskStatusMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import UswdsReactLink from 'components/LinkWrapper';
import toastSuccess from 'components/ToastSuccess';
import { getStatusAlertBody } from 'contexts/ErrorContext';
import { setCurrentErrorMeta } from 'contexts/ErrorContext/errorMetaStore';

import LastModifiedSection from '../../_components/LastModifiedSection';
import {
  getLastEditSectionForTask,
  getSectionsReadyForClearanceCount,
  getSectionStartedCount
} from '../../_utils/modelPlanSectionUtils';

type TaskCardProps = {
  task: GetCollaborationAreaQuery['modelPlan']['tasks'][number];
  modelPlan: GetCollaborationAreaQuery['modelPlan'];
};

type TaskStatusConfig = {
  style: string;
  icon: React.ReactNode;
};

const TASK_STATUS_CONFIG: Partial<Record<PlanTaskStatus, TaskStatusConfig>> = {
  [PlanTaskStatus.TO_DO]: {
    style: 'bg-warning-light',
    icon: <Icon.PriorityHigh aria-label="To do" />
  },
  [PlanTaskStatus.COMPLETE]: {
    style: 'bg-success-dark text-white',
    icon: <Icon.Check aria-label="Complete" />
  }
};

const USER_MARK_STATUS_TASKS = [
  PlanTaskKey.TWO_PAGER,
  PlanTaskKey.SIX_PAGER,
  PlanTaskKey.OA_PRESENTATION
];

const TASK_DOCUMENT_TYPE: Partial<Record<PlanTaskKey, DocumentType>> = {
  [PlanTaskKey.TWO_PAGER]: DocumentType.CONCEPT_PAPER,
  [PlanTaskKey.SIX_PAGER]: DocumentType.CONCEPT_PAPER,
  [PlanTaskKey.OA_PRESENTATION]:
    DocumentType.OFFICE_OF_THE_ADMINISTRATOR_PRESENTATION
};

const isExternalUrl = (path: string) => /^https?:\/\//i.test(path);

function TaskStatusTag({ status }: { status: PlanTaskStatus }) {
  const { t } = useTranslation('tasks');
  const config = TASK_STATUS_CONFIG[status];

  return (
    <div
      className={`line-height-body-1 text-bold display-flex flex-align-center ${config?.style}`}
      style={{ padding: '7px 11px', gap: '0.5rem' }}
    >
      {config?.icon}
      <span>{t(`status.${status}`)}</span>
    </div>
  );
}

const TaskCard = ({ task, modelPlan }: TaskCardProps) => {
  const { t } = useTranslation('tasks');
  const { t: collaborationAreaT } = useTranslation('collaborationArea');

  const navigate = useNavigate();
  const { modelID = '' } = useParams<{ modelID: string }>();

  const { key, state, status } = task;
  const baseKey = `${key}.${state}`;
  const lastEditSection = getLastEditSectionForTask(key, modelPlan);
  const sectionStartedCounter = getSectionStartedCount(modelPlan);
  const sectionsReadyForClearance =
    getSectionsReadyForClearanceCount(modelPlan);

  const primaryAction = t(`${baseKey}.primaryAction`, { defaultValue: '' });
  const secondaryPath = t(`${key}.secondaryPath`, { defaultValue: '' });
  const secondaryAction = t(`${key}.secondaryAction`, { defaultValue: '' });
  const upcomingAlert = t(`${key}.upcomingAlert`, { defaultValue: '' });

  const isPrepareForClearance = key === PlanTaskKey.PREPARE_FOR_CLEARANCE;
  const showClearanceProgress =
    isPrepareForClearance &&
    (state === PlanTaskState.TO_DO ||
      state === PlanTaskState.IN_PROGRESS ||
      state === PlanTaskState.COMPLETE);
  const showClearanceLastEdit =
    isPrepareForClearance &&
    (state === PlanTaskState.IN_PROGRESS || state === PlanTaskState.COMPLETE);

  const [update] = useUpdateTaskStatusMutation();

  const markTaskComplete = (markComplete: boolean) => {
    setCurrentErrorMeta({
      overrideMessage: getStatusAlertBody({
        type: 'error',
        message: t(`${baseKey}.error`)
      })
    });

    update({
      variables: {
        modelPlanID: modelID,
        key: task.key,
        isComplete: markComplete
      },
      refetchQueries: [
        {
          query: GetCollaborationAreaDocument,
          variables: {
            id: modelID
          }
        }
      ]
    }).then(response => {
      if (!response.errors) {
        toastSuccess(
          <Trans
            i18nKey={t(`${baseKey}.success`)}
            components={{
              bold: <span className="text-bold" />
            }}
          />
        );
      }
    });
  };

  const secondaryLink = secondaryAction !== '' && (
    <>
      {isExternalUrl(secondaryPath) ? (
        <a
          href={secondaryPath}
          target="_blank"
          rel="noopener noreferrer"
          className="usa-button usa-button--outline margin-right-2 display-inline-flex flex-align-center"
        >
          {secondaryAction}
          <Icon.Launch className="margin-left-05" aria-label="launch" />
        </a>
      ) : (
        <UswdsReactLink
          to={secondaryPath}
          target="_blank"
          rel="noopener noreferrer"
          className="usa-button usa-button--outline margin-right-2"
          variant="unstyled"
        >
          {secondaryAction}
        </UswdsReactLink>
      )}
    </>
  );

  return (
    <Card
      gridLayout={{ desktop: { col: 12 } }}
      className="collaboration-area__card minh-0 margin-bottom-3"
    >
      <CardHeader>
        <div className="display-flex flex-align-center flex-justify">
          <h3 className="usa-card__heading">{t(`${baseKey}.heading`)}</h3>
          <TaskStatusTag status={status} />
        </div>
      </CardHeader>

      <CardBody>
        <p>
          <Trans
            i18nKey={t(`${key}.copy`)}
            components={{
              email: <Link href={`mailto:${t(`${key}.email`)}`}> </Link>
            }}
          />
        </p>

        {state === PlanTaskState.UPCOMING && upcomingAlert !== '' && (
          <Alert type="info" className="margin-top-2">
            {upcomingAlert}
          </Alert>
        )}

        {(state !== PlanTaskState.TO_DO || showClearanceProgress) && (
          <div className="display-flex flex-align-center flex-wrap-wrap">
            {key === PlanTaskKey.MODEL_PLAN && (
              <>
                <span className="text-base">
                  {collaborationAreaT('modelPlanCard.sectionsStarted', {
                    sectionsStarted: sectionStartedCounter
                  })}
                </span>
                <span className="text-base margin-x-2">|</span>
              </>
            )}
            {showClearanceProgress && (
              <>
                <span className="text-base">
                  {collaborationAreaT(
                    'modelPlanCard.sectionsReadyForClearance',
                    {
                      sectionsReady: sectionsReadyForClearance
                    }
                  )}
                </span>
                {showClearanceLastEdit && lastEditSection && (
                  <span className="text-base margin-x-2">|</span>
                )}
              </>
            )}
            {(showClearanceLastEdit || !isPrepareForClearance) &&
              lastEditSection && (
                <LastModifiedSection section={lastEditSection} />
              )}
          </div>
        )}
      </CardBody>

      <CardFooter className="display-flex border-top-0 padding-top-1">
        {primaryAction !== '' && (
          <Button
            type="button"
            className="margin-right-2"
            onClick={() =>
              navigate(
                t(`${key}.primaryPath`, { modelID, planTaskID: task.id }),
                {
                  state: {
                    fromCollaborationArea: true,
                    documentType: TASK_DOCUMENT_TYPE[key]
                  }
                }
              )
            }
          >
            {primaryAction}
          </Button>
        )}
        {secondaryLink}

        {USER_MARK_STATUS_TASKS.includes(key) && (
          <div className="display-flex flex-align-center">
            {task.status !== PlanTaskStatus.COMPLETE && (
              <CheckboxField
                id={task.id}
                label={t('markComplete')}
                name="markTaskComplete"
                onChange={() => markTaskComplete(true)}
                onBlur={() => {}}
                value="true"
              />
            )}

            {task.status === PlanTaskStatus.COMPLETE && (
              <>
                <Icon.Undo
                  className="text-primary margin-right-1"
                  aria-hidden
                />
                <Button
                  type="button"
                  className="usa-button usa-button--unstyled deep-underline "
                  onClick={() => markTaskComplete(false)}
                >
                  {t('markTodo')}
                </Button>
              </>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
