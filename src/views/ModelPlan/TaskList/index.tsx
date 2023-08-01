import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer,
  IconAnnouncement,
  SummaryBox
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Divider from 'components/shared/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import GetModelPlan from 'queries/GetModelPlan';
import { TaskListSubscription_onLockTaskListSectionContext_lockStatus as LockSectionType } from 'queries/TaskListSubscription/types/TaskListSubscription';
import {
  GetModelPlan as GetModelPlanType,
  GetModelPlan_modelPlan as GetModelPlanTypes,
  GetModelPlan_modelPlan_basics as BasicsType,
  GetModelPlan_modelPlan_beneficiaries as BeneficiariesType,
  GetModelPlan_modelPlan_crTdls as CRTDLType,
  GetModelPlan_modelPlan_discussions as DiscussionType,
  GetModelPlan_modelPlan_documents as DocumentType,
  GetModelPlan_modelPlan_generalCharacteristics as GeneralCharacteristicsType,
  GetModelPlan_modelPlan_operationalNeeds as OperationalNeedsType,
  GetModelPlan_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType,
  GetModelPlan_modelPlan_participantsAndProviders as ParticipantsAndProvidersType,
  GetModelPlan_modelPlan_payments as PaymentsType,
  GetModelPlan_modelPlan_prepareForClearance as PrepareForClearanceType,
  GetModelPlanVariables
} from 'queries/types/GetModelPlan';
import { TaskListSection, TaskStatus } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import { getUnansweredQuestions } from 'utils/modelPlan';
import { isAssessment } from 'utils/user';
import { SubscriptionContext } from 'views/SubscriptionWrapper';

import Discussions from '../Discussions';
import DiscussionModalWrapper from '../Discussions/DiscussionModalWrapper';

import TaskListButton from './_components/TaskListButton';
import TaskListItem, { TaskListDescription } from './_components/TaskListItem';
import TaskListLock from './_components/TaskListLock';
import TaskListSideNav from './_components/TaskListSideNav';
import TaskListStatus from './_components/TaskListStatus';

import './index.scss';

type ITSolutionsType = {
  modifiedDts: string | null;
  status: TaskStatus;
};

type TaskListSectionsType = {
  [key: string]:
    | BasicsType
    | BeneficiariesType
    | GeneralCharacteristicsType
    | OpsEvalAndLearningType
    | ParticipantsAndProvidersType
    | PaymentsType
    | ITSolutionsType
    | PrepareForClearanceType;
};

type TaskListSectionMapType = {
  [key: string]: string;
};

const taskListSectionMap: TaskListSectionMapType = {
  basics: TaskListSection.BASICS,
  beneficiaries: TaskListSection.BENEFICIARIES,
  generalCharacteristics: TaskListSection.GENERAL_CHARACTERISTICS,
  opsEvalAndLearning: TaskListSection.OPERATIONS_EVALUATION_AND_LEARNING,
  participantsAndProviders: TaskListSection.PARTICIPANTS_AND_PROVIDERS,
  payments: TaskListSection.PAYMENT,
  prepareForClearance: TaskListSection.PREPARE_FOR_CLEARANCE
};

const TaskList = () => {
  const { t } = useTranslation('modelPlanTaskList');
  const { t: h } = useTranslation('draftModelPlan');

  const { modelID } = useParams<{ modelID: string }>();

  // Get discussionID from generated email link
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const discussionID = params.get('discussionID');

  const flags = useFlags();

  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);

  const { euaId, groups } = useSelector((state: RootStateOrAny) => state.auth);

  // Used to conditonally render role specific text in task list
  const userRole = isAssessment(groups, flags) ? 'assessment' : 'team';

  const { taskListSectionLocks } = useContext(SubscriptionContext);

  const { data, loading, error } = useQuery<
    GetModelPlanType,
    GetModelPlanVariables
  >(GetModelPlan, {
    variables: {
      id: modelID
    }
  });

  const modelPlan = data?.modelPlan || ({} as GetModelPlanTypes);

  const {
    modelName,
    basics,
    discussions,
    documents,
    crTdls,
    status,
    generalCharacteristics,
    participantsAndProviders,
    opsEvalAndLearning,
    beneficiaries,
    payments,
    operationalNeeds = [],
    prepareForClearance,
    collaborators
  } = modelPlan;

  const getITSolutionsStatus = (
    operationalNeedsArray: OperationalNeedsType[]
  ) => {
    const inProgress = operationalNeedsArray.find(need => need.modifiedDts);
    return inProgress ? TaskStatus.IN_PROGRESS : TaskStatus.READY;
  };

  const getLatestModifiedDate = (
    operationalNeedsArray: OperationalNeedsType[]
  ) => {
    if (operationalNeedsArray.length !== 0) {
      return operationalNeedsArray
        .filter(need => !!need.modifiedDts)
        .reduce((a, b) => (a.modifiedDts! > b.modifiedDts! ? a : b))
        .modifiedDts;
    }
    return null;
  };

  const itSolutions: ITSolutionsType = {
    modifiedDts: getLatestModifiedDate(operationalNeeds),
    status: getITSolutionsStatus(operationalNeeds)
  };

  const taskListSections: TaskListSectionsType = {
    basics,
    generalCharacteristics,
    participantsAndProviders,
    beneficiaries,
    opsEvalAndLearning,
    payments,
    itSolutions,
    prepareForClearance
  };

  const { unansweredQuestions, answeredQuestions } = getUnansweredQuestions(
    discussions
  );

  useEffect(() => {
    if (discussionID) setIsDiscussionOpen(true);
  }, [discussionID]);

  const getTaskListLockedStatus = (
    section: string
  ): LockSectionType | undefined => {
    return taskListSectionLocks.find(
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
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{t('navigation.home')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{t('navigation.modelPlanTaskList')}</Breadcrumb>
          </BreadcrumbBar>
        </Grid>
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
        {loading && (
          <div className="height-viewport">
            <PageLoading />
          </div>
        )}
        {!loading && data && (
          <Grid row gap>
            <Grid desktop={{ col: 9 }}>
              <PageHeading className="margin-top-4 margin-bottom-0">
                {t('navigation.modelPlanTaskList')}
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

              <TaskListStatus
                modelID={modelID}
                status={status}
                updateLabel
                statusLabel
              />

              <DicussionBanner
                discussions={discussions}
                unansweredQuestions={unansweredQuestions}
                answeredQuestions={answeredQuestions}
                setIsDiscussionOpen={setIsDiscussionOpen}
              />

              {/* Document and CR TDL Banners */}
              <Grid row gap={2}>
                <Grid desktop={{ col: 6 }} className="margin-top-2">
                  <DocumentBanner
                    documents={documents}
                    modelID={modelID}
                    expand={!!documents.length || !!crTdls.length}
                  />
                </Grid>

                <Grid desktop={{ col: 6 }} className="margin-top-2">
                  <CRTDLBanner
                    crTdls={crTdls}
                    modelID={modelID}
                    expand={!!documents.length || !!crTdls.length}
                  />
                </Grid>
              </Grid>

              <ol
                data-testid="task-list"
                className="model-plan-task-list__task-list model-plan-task-list__task-list--primary margin-top-6 margin-bottom-0 padding-left-0"
              >
                {Object.keys(taskListSections).map((key: string) => {
                  if (flags.hideITLeadExperience && key === 'itSolutions') {
                    return <div key={key} />;
                  }

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
                            {key === 'itSolutions' &&
                              userRole !== 'assessment' && (
                                <p className="margin-top-0">
                                  {t(`numberedList.${key}.${userRole}2`)}
                                </p>
                              )}
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

                        <TaskListLock
                          isAssessment={
                            !!getTaskListLockedStatus(key)?.isAssessment
                          }
                          selfLocked={
                            getTaskListLockedStatus(key)?.lockedByUserAccount
                              .username === euaId
                          }
                          lockedByUserAccount={
                            getTaskListLockedStatus(key)?.lockedByUserAccount
                          }
                        />
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
  unansweredQuestions: number;
  answeredQuestions: number;
  setIsDiscussionOpen: Dispatch<SetStateAction<boolean>>;
};

// Banner to display discussion information and launch discussion center
const DicussionBanner = ({
  discussions,
  unansweredQuestions,
  answeredQuestions,
  setIsDiscussionOpen
}: DiscussionBannerType) => {
  const { t: d } = useTranslation('discussions');

  return (
    <SummaryBox
      heading={d('heading')}
      className="bg-primary-lighter border-0 radius-0 padding-2"
    >
      <div
        className={classNames('margin-top-1', {
          'mint-header__basic': discussions?.length > 0
        })}
      >
        {discussions?.length > 0 ? (
          <>
            <div>
              <IconAnnouncement />{' '}
              {unansweredQuestions > 0 && (
                <>
                  <strong>{unansweredQuestions}</strong> {d('unanswered')}
                  {unansweredQuestions > 1 && 's'}{' '}
                </>
              )}
              {answeredQuestions > 0 && (
                <>
                  {unansweredQuestions > 0 && 'and '}
                  <strong>{answeredQuestions}</strong> {d('answered')}
                  {answeredQuestions > 1 && 's'}
                </>
              )}
            </div>
            <Button
              type="button"
              unstyled
              onClick={() => setIsDiscussionOpen(true)}
            >
              {d('viewDiscussions')}
            </Button>
          </>
        ) : (
          <>
            {d('noDiscussions')}
            <Button
              className="line-height-body-5 test-withdraw-request"
              type="button"
              unstyled
              onClick={() => setIsDiscussionOpen(true)}
            >
              {d('askAQuestionLink')}{' '}
            </Button>{' '}
            {d('toGetStarted')}
          </>
        )}
      </div>
    </SummaryBox>
  );
};

type DocumentBannerType = {
  documents: DocumentType[];
  modelID: string;
  expand: boolean;
};

// Document component for rendering document summary
const DocumentBanner = ({ documents, modelID, expand }: DocumentBannerType) => {
  const { t } = useTranslation('modelPlanTaskList');

  return (
    <SummaryBox
      heading=""
      className={classNames('bg-base-lightest border-0 radius-0 padding-2', {
        'model-plan-task-list__min-card': expand
      })}
    >
      <h3 className="margin-0">
        {t('modelPlanTaskList:documentSummaryBox.heading')}
      </h3>

      {documents?.length > 0 ? (
        <>
          <p
            className="margin-0 padding-bottom-1 padding-top-05"
            data-testid="document-items"
          >
            <strong>{documents.length} </strong>
            <Trans i18nKey="modelPlanTaskList:documentSummaryBox.existingDocuments">
              indexZero {documents.length > 1 ? 's' : ''}
            </Trans>
          </p>

          <UswdsReactLink
            variant="unstyled"
            className="margin-right-4 display-block margin-bottom-1"
            to={`/models/${modelID}/documents`}
          >
            {t('documentSummaryBox.viewAll')}
          </UswdsReactLink>

          <UswdsReactLink
            variant="unstyled"
            to={`/models/${modelID}/documents/add-document`}
          >
            {t('documentSummaryBox.uploadAnother')}
          </UswdsReactLink>
        </>
      ) : (
        <>
          <p className="margin-0 margin-bottom-1">
            <Trans i18nKey="modelPlanTaskList:documentSummaryBox.copy">
              indexZero
            </Trans>
          </p>

          <UswdsReactLink
            className="usa-button usa-button--outline"
            variant="unstyled"
            to={`/models/${modelID}/documents/add-document`}
          >
            {t('documentSummaryBox.cta')}
          </UswdsReactLink>
        </>
      )}
    </SummaryBox>
  );
};

type CRTDLBannerType = {
  crTdls: CRTDLType[];
  modelID: string;
  expand: boolean;
};

// CRTDL component for rendering CRTDL summary
const CRTDLBanner = ({ crTdls, modelID, expand }: CRTDLBannerType) => {
  const { t } = useTranslation('modelPlanTaskList');

  return (
    <SummaryBox
      heading=""
      className={classNames('bg-base-lightest border-0 radius-0 padding-2', {
        'model-plan-task-list__min-card': expand
      })}
    >
      <h3 className="margin-0">
        {t('modelPlanTaskList:crTDLsSummaryBox.heading')}
      </h3>

      {crTdls?.length > 0 ? (
        <>
          <p
            className="margin-0 padding-bottom-1 padding-top-05"
            data-testid="cr-tdl-items"
          >
            {crTdls.map(
              (crtdl, index) =>
                index < 3 &&
                `${crtdl.idNumber}${index !== crTdls.length - 1 ? ',' : ''} `
            )}
            {crTdls.length > 3 &&
              `+${crTdls.length - 3} ${t('crTDLsSummaryBox.more')}`}{' '}
          </p>

          <UswdsReactLink
            variant="unstyled"
            className="margin-right-4 display-block margin-bottom-1"
            to={`/models/${modelID}/cr-and-tdl`}
          >
            {t('crTDLsSummaryBox.viewAll')}
          </UswdsReactLink>

          <UswdsReactLink
            variant="unstyled"
            to={`/models/${modelID}/cr-and-tdl/add-cr-and-tdl`}
          >
            {t('crTDLsSummaryBox.uploadAnother')}
          </UswdsReactLink>
        </>
      ) : (
        <>
          <p className="margin-0 margin-bottom-1">
            <Trans i18nKey="modelPlanTaskList:crTDLsSummaryBox.copy">
              indexZero
            </Trans>
          </p>

          <UswdsReactLink
            className="usa-button usa-button--outline"
            variant="unstyled"
            to={`/models/${modelID}/cr-and-tdl/add-cr-and-tdl`}
          >
            {t('crTDLsSummaryBox.add')}
          </UswdsReactLink>
        </>
      )}
    </SummaryBox>
  );
};

export default TaskList;
