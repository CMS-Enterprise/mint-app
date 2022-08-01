import React, { Fragment, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
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

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import Divider from 'components/shared/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import GetModelPlan from 'queries/GetModelPlan';
import {
  GetModelPlan as GetModelPlanType,
  GetModelPlan_modelPlan as GetModelPlanTypes,
  GetModelPlan_modelPlan_basics as BasicsType,
  GetModelPlan_modelPlan_beneficiaries as BeneficiariesType,
  GetModelPlan_modelPlan_generalCharacteristics as GeneralCharacteristicsType,
  GetModelPlan_modelPlan_opsEvalAndLearning as OpsEvalAndLearningType,
  GetModelPlan_modelPlan_participantsAndProviders as ParticipantsAndProvidersType,
  GetModelPlan_modelPlan_payments as PaymentsType,
  GetModelPlanVariables
} from 'queries/types/GetModelPlan';
import { TaskStatus } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';
import { getUnansweredQuestions } from 'utils/modelPlan';

import Discussions from '../Discussions';

import TaskListButton from './_components/TaskListButton';
import TaskListItem, {
  TaskListDescription,
  TaskListLastUpdated
} from './_components/TaskListItem';
import TaskListSideNav from './_components/TaskListSideNav';
import TaskListStatus from './_components/TaskListStatus';

import './index.scss';

type TaskListSectionsType = {
  [key: string]:
    | BasicsType
    | BeneficiariesType
    | GeneralCharacteristicsType
    | OpsEvalAndLearningType
    | ParticipantsAndProvidersType
    | PaymentsType;
};

const TaskList = () => {
  const { t } = useTranslation('modelPlanTaskList');
  const { t: h } = useTranslation('draftModelPlan');
  const { t: d } = useTranslation('discussions');
  const { modelID } = useParams<{ modelID: string }>();
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);

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
    modifiedDts,
    basics,
    milestones,
    modelCategory,
    cmsCenters,
    discussions,
    documents,
    status,
    generalCharacteristics,
    participantsAndProviders,
    opsEvalAndLearning,
    beneficiaries,
    payments
    // itTools
  } = modelPlan;

  const taskListSections: TaskListSectionsType = {
    basics,
    generalCharacteristics,
    participantsAndProviders,
    beneficiaries,
    opsEvalAndLearning,
    payments
    // itTools
  };

  const { unansweredQuestions, answeredQuestions } = getUnansweredQuestions(
    discussions
  );

  /**
   * Used to calculate status on Basics as milstones is encapsulated in Basics, but has it's own status
   * May be changed/merged in the future to match other task list sections
   * */
  const renderBasicsStatus = (): TaskStatus => {
    if (
      // * TEMPORARY SOLUTION to render "READY FOR REVIEW" on Task List page, until better solution from BE
      // basics.status === TaskStatus.READY_FOR_REVIEW &&
      milestones.status === TaskStatus.READY_FOR_REVIEW
    ) {
      return TaskStatus.READY_FOR_REVIEW;
    }
    if (modelCategory === null && cmsCenters.length === 0) {
      return TaskStatus.READY;
    }
    return TaskStatus.IN_PROGRESS;
  };

  /**
   * Used to calculate last modified date on Basics as milstones is encapsulated in Basics, but has it's modifiedDts
   * May be changed/merged in the future to match other task list sections
   * */
  const renderBasicsLastUpdated = () => {
    const basicDates = [
      modifiedDts,
      basics?.modifiedDts,
      milestones.modifiedDts
    ];
    basicDates.sort((a, b) => {
      return a?.localeCompare(b!) || 0;
    });
    return basicDates[0];
  };

  const dicussionBanner = () => {
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
        {!loading && data && (
          <Grid row gap>
            <Grid desktop={{ col: 9 }}>
              {data && (
                <>
                  <PageHeading className="margin-top-4 margin-bottom-0">
                    {t('navigation.modelPlanTaskList')}
                  </PageHeading>
                  <p
                    className="margin-top-0 margin-bottom-2 font-body-lg"
                    data-testid="model-plan-name"
                  >
                    {h('for')} {modelName}
                  </p>

                  {isDiscussionOpen && (
                    <Discussions
                      modelID={modelID}
                      isOpen={isDiscussionOpen}
                      closeModal={() => setIsDiscussionOpen(false)}
                    />
                  )}

                  <TaskListStatus modelID={modelID} status={status} />
                  {dicussionBanner()}
                  <SummaryBox
                    heading=""
                    className="bg-base-lightest border-0 radius-0 padding-2"
                  >
                    {documents?.length > 0 ? (
                      <>
                        <p
                          className="margin-0 margin-bottom-1"
                          data-testid="document-items"
                        >
                          <strong>{documents.length} </strong>
                          <Trans i18nKey="modelPlanTaskList:summaryBox.existingDocuments">
                            indexZero {documents.length > 1 ? 's' : ''} indexOne
                          </Trans>
                          {modelName}
                        </p>
                        <Grid row gap>
                          <Grid tablet={{ col: 4 }}>
                            <UswdsReactLink
                              variant="unstyled"
                              className="margin-right-4"
                              to={`/models/${modelID}/documents`}
                            >
                              {t('summaryBox.viewAll')}
                            </UswdsReactLink>
                          </Grid>
                          <Grid tablet={{ col: 4 }}>
                            <UswdsReactLink
                              variant="unstyled"
                              to={`/models/${modelID}/documents/add-document`}
                            >
                              {t('summaryBox.uploadAnother')}
                            </UswdsReactLink>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <p className="margin-0 margin-bottom-1">
                          <Trans i18nKey="modelPlanTaskList:summaryBox.copy">
                            indexZero {modelName} indexTwo
                          </Trans>
                        </p>
                        <UswdsReactLink
                          className="usa-button usa-button--outline"
                          variant="unstyled"
                          to={`/models/${modelID}/documents`}
                        >
                          {t('summaryBox.cta')}
                        </UswdsReactLink>
                      </>
                    )}
                  </SummaryBox>
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
                            status={
                              key === 'basics'
                                ? renderBasicsStatus()
                                : taskListSections[key].status
                            }
                          >
                            <div className="model-plan-task-list__task-row display-flex flex-justify flex-align-start">
                              <TaskListDescription>
                                <p className="margin-top-0">
                                  {t(`numberedList.${key}.copy`)}
                                </p>
                              </TaskListDescription>

                              {/* Basics needs to render the last updated data based on multiple modifiedDts values */}
                              {key === 'basics' &&
                                renderBasicsStatus() !== TaskStatus.READY && (
                                  <TaskListLastUpdated>
                                    <p className="margin-y-0">
                                      {t('taskListItem.lastUpdated')}
                                    </p>
                                    <p className="margin-y-0">
                                      {key === 'basics' &&
                                        renderBasicsLastUpdated() &&
                                        formatDate(
                                          renderBasicsLastUpdated() || '',
                                          'MM/d/yyyy'
                                        )}
                                      {key !== 'basics' &&
                                        taskListSections[key].modifiedDts &&
                                        formatDate(
                                          taskListSections[key].modifiedDts!,
                                          'MM/d/yyyy'
                                        )}
                                    </p>
                                  </TaskListLastUpdated>
                                )}

                              {key !== 'basics' &&
                                taskListSections[key].status !==
                                  TaskStatus.READY && (
                                  <TaskListLastUpdated>
                                    <p className="margin-y-0">
                                      {t('taskListItem.lastUpdated')}
                                    </p>
                                    <p className="margin-y-0">
                                      {taskListSections[key].modifiedDts &&
                                        formatDate(
                                          taskListSections[key].modifiedDts!,
                                          'MM/d/yyyy'
                                        )}
                                    </p>
                                  </TaskListLastUpdated>
                                )}
                            </div>
                            <TaskListButton
                              path={t(`numberedList.${key}.path`)}
                              status={taskListSections[key].status}
                            />
                          </TaskListItem>
                          {key !== 'itTools' && (
                            <Divider className="margin-bottom-4" />
                          )}
                        </Fragment>
                      );
                    })}
                  </ol>
                </>
              )}
            </Grid>
            <Grid desktop={{ col: 3 }}>
              {data && <TaskListSideNav modelPlan={modelPlan} />}
            </Grid>
          </Grid>
        )}
      </GridContainer>
    </MainContent>
  );
};

export default TaskList;
