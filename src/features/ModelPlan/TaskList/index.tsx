import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import ReactGA from 'react-ga4';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  Button,
  Grid,
  GridContainer,
  Icon,
  SummaryBox,
  SummaryBoxContent
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  GetLockedModelPlanSectionsQuery,
  GetModelPlanQuery,
  LockableSection,
  useGetModelPlanQuery
} from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import Divider from 'components/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import UpdateStatusModal from 'components/UpdateStatusModal';
import { SubscriptionContext } from 'contexts/PageLockContext';
import useMessage from 'hooks/useMessage';
import { formatDateLocal } from 'utils/date';
import { isAssessment } from 'utils/user';

import SectionLock from '../../../components/SectionLock';
import Discussions from '../Discussions';
import DiscussionModalWrapper from '../Discussions/DiscussionModalWrapper';

import TaskListButton from './_components/TaskListButton';
import TaskListItem, { TaskListDescription } from './_components/TaskListItem';
import TaskListSideNav from './_components/TaskListSideNav';

import './index.scss';

type TaskListSectionLockStatus =
  GetLockedModelPlanSectionsQuery['lockableSectionLocks'][0];

type GetModelPlanTypes = GetModelPlanQuery['modelPlan'];
type BasicsType = GetModelPlanQuery['modelPlan']['basics'];

type DiscussionType = GetModelPlanQuery['modelPlan']['discussions'][0];
type BeneficiariesType = GetModelPlanQuery['modelPlan']['beneficiaries'];
type GeneralCharacteristicsType =
  GetModelPlanQuery['modelPlan']['generalCharacteristics'];
type OpsEvalAndLearningType =
  GetModelPlanQuery['modelPlan']['opsEvalAndLearning'];
type ParticipantsAndProvidersType =
  GetModelPlanQuery['modelPlan']['participantsAndProviders'];
type PaymentsType = GetModelPlanQuery['modelPlan']['payments'];
type PrepareForClearanceType =
  GetModelPlanQuery['modelPlan']['prepareForClearance'];

type TaskListSectionsType = {
  [key: string]:
    | BasicsType
    | BeneficiariesType
    | GeneralCharacteristicsType
    | OpsEvalAndLearningType
    | ParticipantsAndProvidersType
    | PaymentsType
    | PrepareForClearanceType;
};

const taskListSectionMap: Partial<Record<string, LockableSection>> = {
  basics: LockableSection.BASICS,
  generalCharacteristics: LockableSection.GENERAL_CHARACTERISTICS,
  participantsAndProviders: LockableSection.PARTICIPANTS_AND_PROVIDERS,
  beneficiaries: LockableSection.BENEFICIARIES,
  opsEvalAndLearning: LockableSection.OPERATIONS_EVALUATION_AND_LEARNING,
  payments: LockableSection.PAYMENT,
  prepareForClearance: LockableSection.PREPARE_FOR_CLEARANCE
};

export type StatusMessageType = {
  message: string;
  status: 'success' | 'error';
};

const TaskList = () => {
  const { t } = useTranslation('modelPlanTaskList');
  const { t: h } = useTranslation('general');

  const { modelID } = useParams<{ modelID: string }>();

  const { message } = useMessage();

  const location = useLocation();

  const params = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  // Get discussionID from generated email link
  const discussionID = params.get('discussionID');

  const flags = useFlags();

  const [isDiscussionOpen, setIsDiscussionOpen] = useState<boolean>(false);

  const [statusMessage, setStatusMessage] = useState<StatusMessageType | null>(
    null
  );

  const { euaId, groups } = useSelector((state: RootStateOrAny) => state.auth);

  // Used to conditonally render role specific text in task list
  const userRole = isAssessment(groups, flags) ? 'assessment' : 'team';

  const { lockableSectionLocks } = useContext(SubscriptionContext);

  const { data, loading, error, refetch } = useGetModelPlanQuery({
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || ({} as GetModelPlanTypes);

  const {
    modelName,
    basics,
    discussions,
    status,
    generalCharacteristics,
    participantsAndProviders,
    opsEvalAndLearning,
    beneficiaries,
    payments,
    prepareForClearance,
    collaborators,
    suggestedPhase
  } = modelPlan;

  const taskListSections: TaskListSectionsType = {
    basics,
    generalCharacteristics,
    participantsAndProviders,
    beneficiaries,
    opsEvalAndLearning,
    payments,
    prepareForClearance
  };

  // Gets the sessions storage variable for statusChecked of modelPlan
  const statusCheckedStorage =
    sessionStorage.getItem(`statusChecked-${modelID}`) === 'true';

  // Aligns session with default value of state
  const [statusChecked, setStatusChecked] =
    useState<boolean>(statusCheckedStorage);

  // Status phase modal state
  const [isStatusPhaseModalOpen, setStatusPhaseModalOpen] = useState<boolean>(
    !!suggestedPhase || false
  );

  // Updates state if session value changes
  useEffect(() => {
    setStatusChecked(statusCheckedStorage);
  }, [statusCheckedStorage]);

  // Sets the modal open state based on session state and suggested phase
  useEffect(() => {
    if (suggestedPhase && !statusChecked) setStatusPhaseModalOpen(true);
  }, [suggestedPhase, statusChecked]);

  useEffect(() => {
    if (discussionID) setIsDiscussionOpen(true);
  }, [discussionID]);

  const getTaskListLockedStatus = (
    section: string
  ): TaskListSectionLockStatus | undefined => {
    return lockableSectionLocks.find(
      sectionLock => sectionLock.section === taskListSectionMap[section]
    );
  };

  return (
    <MainContent
      className="model-plan-task-list"
      data-testid="model-plan-task-list"
    >
      <GridContainer>
        <Grid desktop={{ col: 12 }}>
          <Breadcrumbs
            items={[
              BreadcrumbItemOptions.HOME,
              BreadcrumbItemOptions.COLLABORATION_AREA,
              BreadcrumbItemOptions.TASK_LIST
            ]}
          />
        </Grid>

        {!!modelPlan.suggestedPhase && !statusChecked && (
          <UpdateStatusModal
            modelID={modelID}
            isOpen={isStatusPhaseModalOpen}
            closeModal={() => {
              sessionStorage.setItem(`statusChecked-${modelID}`, 'true');
              setStatusPhaseModalOpen(false);
            }}
            currentStatus={status}
            suggestedPhase={modelPlan.suggestedPhase}
            setStatusMessage={setStatusMessage}
            refetch={refetch}
          />
        )}

        {error && (
          <ErrorAlert
            testId="formik-validation-errors"
            classNames="margin-top-3"
            heading={t('errorHeading')}
          >
            <ErrorAlertMessage
              errorKey="error-document"
              message={t('errorMessage')}
            />
          </ErrorAlert>
        )}

        {message && (
          <Alert slim type="success">
            {message}
          </Alert>
        )}

        {!loading && statusMessage && (
          <Alert slim type={statusMessage.status} closeAlert={setStatusMessage}>
            {statusMessage.message}
          </Alert>
        )}

        {/* Wait for model status query param to be removed */}
        {loading && (
          <div className="height-viewport">
            <PageLoading />
          </div>
        )}

        {!loading && data && (
          <Grid row gap>
            <Grid desktop={{ col: 9 }}>
              <PageHeading className="margin-top-4 margin-bottom-0">
                {t('heading')}
              </PageHeading>
              <p
                className="margin-top-0 margin-bottom-2 font-body-lg"
                data-testid="model-plan-name"
              >
                {h('for')} {modelName}
              </p>

              {/* Discussion modal */}
              {isDiscussionOpen && (
                <DiscussionModalWrapper
                  isOpen={isDiscussionOpen}
                  closeModal={() => setIsDiscussionOpen(false)}
                >
                  <Discussions modelID={modelID} discussionID={discussionID} />
                </DiscussionModalWrapper>
              )}

              <div className="padding-y-1">
                <UswdsReactLink
                  to={`/models/${modelID}/collaboration-area`}
                  data-testid="return-to-collaboration"
                >
                  <span>
                    <Icon.ArrowBack
                      className="top-3px margin-right-1"
                      aria-label="back"
                    />
                    {t('returnToCollaboration')}
                  </span>
                </UswdsReactLink>
              </div>

              <DicussionBanner
                discussions={discussions}
                setIsDiscussionOpen={setIsDiscussionOpen}
              />

              <ol
                data-testid="task-list"
                className="model-plan-task-list__task-list model-plan-task-list__task-list--primary margin-top-6 margin-bottom-0 padding-left-0"
              >
                {Object.keys(taskListSections).map((key: string) => {
                  return (
                    <Fragment key={key}>
                      <TaskListItem
                        key={key}
                        testId={`task-list-intake-form-${key}`}
                        heading={t(`numberedList.${key}.heading`)}
                        lastUpdated={
                          taskListSections[key].modifiedDts &&
                          formatDateLocal(
                            taskListSections[key].modifiedDts!,
                            'MM/dd/yyyy'
                          )
                        }
                        status={taskListSections[key].status}
                      >
                        <div className="model-plan-task-list__task-row display-flex flex-justify flex-align-start">
                          <TaskListDescription>
                            <p className="margin-top-0">
                              {t(`numberedList.${key}.${userRole}`)}
                            </p>
                          </TaskListDescription>
                        </div>
                        <TaskListButton
                          ariaLabel={t(`numberedList.${key}.heading`)}
                          path={t(`numberedList.${key}.path`)}
                          disabled={
                            !!getTaskListLockedStatus(key) &&
                            getTaskListLockedStatus(key)?.lockedByUserAccount
                              .username !== euaId
                          }
                          status={taskListSections[key].status}
                        />

                        {taskListSectionMap[key] && (
                          <SectionLock section={taskListSectionMap[key]} />
                        )}
                      </TaskListItem>
                      {key !== 'prepareForClearance' && (
                        <Divider className="margin-bottom-4" />
                      )}
                    </Fragment>
                  );
                })}
              </ol>
            </Grid>
            <Grid desktop={{ col: 3 }}>
              <TaskListSideNav
                modelPlan={modelPlan}
                collaborators={collaborators}
                setStatusMessage={setStatusMessage}
              />
            </Grid>
          </Grid>
        )}
      </GridContainer>
    </MainContent>
  );
};

type DiscussionBannerType = {
  discussions: DiscussionType[];
  setIsDiscussionOpen: Dispatch<SetStateAction<boolean>>;
};

// Banner to display discussion information and launch discussion center
const DicussionBanner = ({
  discussions,
  setIsDiscussionOpen
}: DiscussionBannerType) => {
  const { t: d } = useTranslation('discussionsMisc');

  return (
    <SummaryBox className="bg-primary-lighter border-0 radius-0 padding-2">
      <SummaryBoxContent
        className={classNames('padding-0 display-flex flex-justify', {
          'mint-header__basic': discussions?.length > 0
        })}
      >
        <div className="display-block margin-right-2">
          <h3 className="margin-0">{d('heading')}</h3>
          {discussions?.length === 0 ? (
            <>
              {d('noDiscussions')}
              <Button
                className="line-height-body-5 test-withdraw-request"
                type="button"
                unstyled
                onClick={() => {
                  // Send a discussion open event to GA
                  ReactGA.send({
                    hitType: 'event',
                    eventCategory: 'discussion_center_opened',
                    eventAction: 'click',
                    eventLabel: 'Discussion Center opened'
                  });

                  setIsDiscussionOpen(true);
                }}
              >
                {d('askAQuestionLink')}.
              </Button>
            </>
          ) : (
            <div className="display-flex flex-align-center">
              <Icon.Announcement
                className="margin-right-1"
                aria-label="announcement"
              />
              <div>
                <strong>{discussions.length}</strong>
                {d('discussionBanner.discussion', {
                  count: discussions.length
                })}
              </div>
            </div>
          )}
        </div>

        {discussions?.length > 0 && (
          <>
            <Button
              type="button"
              unstyled
              onClick={() => {
                // Send a discussion open event to GA
                ReactGA.send({
                  hitType: 'event',
                  eventCategory: 'discussion_center_opened',
                  eventAction: 'click',
                  eventLabel: 'Discussion Center opened'
                });

                setIsDiscussionOpen(true);
              }}
            >
              {d('viewDiscussions')}
            </Button>
          </>
        )}
      </SummaryBoxContent>
    </SummaryBox>
  );
};

export default TaskList;
