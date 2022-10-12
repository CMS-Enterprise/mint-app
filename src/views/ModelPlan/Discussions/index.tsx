import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import {
  Accordion,
  Button,
  Grid,
  IconAnnouncement,
  Label,
  Textarea
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import AssessmentIcon from 'components/shared/AssessmentIcon';
import Divider from 'components/shared/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import Expire from 'components/shared/Expire';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import IconInitial from 'components/shared/IconInitial';
import CreateModelPlanReply from 'queries/CreateModelPlanReply';
import CreateModelPlanDiscussion from 'queries/Discussions/CreateModelPlanDiscussion';
import GetModelPlanDiscussions from 'queries/Discussions/GetModelPlanDiscussions';
import { CreateModelPlanDiscussion as CreateModelPlanDiscussionType } from 'queries/Discussions/types/CreateModelPlanDiscussion';
import {
  GetModelPlanDiscussions as GetModelPlanDiscussionsType,
  GetModelPlanDiscussionsVariables
} from 'queries/Discussions/types/GetModelPlanDiscussions';
import { UpdateModelPlanDiscussion as UpdateModelPlanDiscussionType } from 'queries/Discussions/types/UpdateModelPlanDiscussion';
import UpdateModelPlanDiscussion from 'queries/Discussions/UpdateModelPlanDiscussion';
import {
  CreateModelPlanReply as CreateModelPlanReplyType,
  CreateModelPlanReply_createDiscussionReply as ReplyType
} from 'queries/types/CreateModelPlanReply';
import { GetModelPlan_modelPlan_discussions as DiscussionType } from 'queries/types/GetModelPlan';
import { DiscussionStatus } from 'types/graphql-global-types';
import { getTimeElapsed } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import { getUnansweredQuestions, sortRepliesByDate } from 'utils/modelPlan';

import DiscussionModalWrapper from './DiscussionModalWrapper';

import './index.scss';

export type DiscussionsProps = {
  modelID: string;
  isOpen: boolean;
  askAQuestion?: boolean;
  openModal?: () => void;
  closeModal: () => void;
};

type DicussionFormPropTypes = {
  content: string;
};

const Discussions = ({
  modelID,
  isOpen,
  askAQuestion,
  openModal,
  closeModal
}: DiscussionsProps) => {
  const { t } = useTranslation('discussions');
  const { t: h } = useTranslation('draftModelPlan');

  const { data, loading, error, refetch } = useQuery<
    GetModelPlanDiscussionsType,
    GetModelPlanDiscussionsVariables
  >(GetModelPlanDiscussions, {
    variables: {
      id: modelID
    }
  });

  // Used to map EUA ids to full name
  const collaborators = data?.modelPlan?.collaborators || [];

  const discussions = useMemo(() => {
    return data?.modelPlan?.discussions || ([] as DiscussionType[]);
  }, [data?.modelPlan?.discussions]);

  const [createQuestion] = useMutation<CreateModelPlanDiscussionType>(
    CreateModelPlanDiscussion
  );

  const [createReply] = useMutation<CreateModelPlanReplyType>(
    CreateModelPlanReply
  );

  const [updateDiscussion] = useMutation<UpdateModelPlanDiscussionType>(
    UpdateModelPlanDiscussion
  );

  const createDiscussionMethods = {
    question: createQuestion,
    reply: createReply
  };

  const [discussionType, setDiscussionType] = useState<
    'question' | 'reply' | 'discussion'
  >('question');

  const [discussionStatus, setDiscussionStatus] = useState<'success' | 'error'>(
    'success'
  );

  const [discussionStatusMessage, setDiscussionStatusMessage] = useState('');

  // State used to control when the component is being rendered from a form page rather than the task-list
  const [initQuestion, setInitQuestion] = useState<boolean | undefined>(
    askAQuestion
  );

  const [questionCount, setQuestionCount] = useState({
    answeredQuestions: 0,
    unansweredQuestions: 0
  });

  // State and setter used for containing the related question when replying
  const [reply, setReply] = useState<DiscussionType | ReplyType | null>(null);

  const validationSchema = Yup.object().shape({
    content: Yup.string().trim().required(`Please enter a ${discussionType}`)
  });

  // Hook used to conditionally render each discussionType by its setter method
  useEffect(() => {
    if (discussions?.length === 0 || initQuestion) {
      setDiscussionType('question');
    } else {
      setDiscussionType('discussion');
    }
    setQuestionCount(getUnansweredQuestions(discussions));
  }, [discussions, initQuestion]);

  // Handles the default expanded render of accordions based on if there are more than zero questions
  const openStatus = (status: DiscussionStatus) => {
    return status === 'ANSWERED'
      ? questionCount.answeredQuestions > 0
      : questionCount.unansweredQuestions > 0;
  };

  const handleCreateDiscussion = (formikValues: DicussionFormPropTypes) => {
    let payload = {};

    // Setting the mutation payload depending on discussionType
    if (discussionType === 'question') {
      payload = {
        modelPlanID: modelID,
        content: formikValues.content
      };
    } else if (discussionType === 'reply' && reply) {
      payload = {
        discussionID: reply.id,
        content: formikValues.content,
        resolution: true
      };
    } else {
      return; // Currently we have no mutations when discussions is displayed
    }

    createDiscussionMethods[discussionType]({
      variables: {
        input: payload
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (discussionType === 'reply' && reply?.id) {
            handleUpdateDiscussion(reply.id);
          } else {
            refetch().then(() => {
              setInitQuestion(false);
              setDiscussionType('discussion');
            });
          }

          setDiscussionStatus('success');
          setDiscussionStatusMessage(
            discussionType === 'question' ? t('success') : t('successAnswer')
          );
        }
      })
      .catch(() => {
        setDiscussionStatus('error');
        setDiscussionStatusMessage(
          discussionType === 'question' ? t('error') : t('errorAnswer')
        );
      });
  };

  const handleUpdateDiscussion = (id: string) => {
    updateDiscussion({
      variables: {
        id,
        changes: {
          status: 'ANSWERED' // For now any question that has a reply will bw considered "ANSWERED"
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          refetch().then(() => {
            setInitQuestion(false);
            setDiscussionType('discussion');
          });
        }
      })
      .catch(() => {
        setDiscussionStatus('error');
        setDiscussionStatusMessage(t('error'));
      });
  };

  const renderQuestion = (renderType: 'question' | 'reply') => {
    return (
      <>
        <PageHeading headingLevel="h1" className="margin-y-0">
          {renderType === 'question' ? t('askAQuestion') : t('answer')}
        </PageHeading>

        <p className="margin-bottom-4">
          {renderType === 'question'
            ? t('description')
            : t('answerDescription')}
        </p>

        {/* General error message for mutations that expires after 3 seconds */}
        {discussionStatusMessage && (
          <Expire delay={3000} callback={setDiscussionStatusMessage}>
            <Alert className="margin-bottom-4" type={discussionStatus}>
              {discussionStatusMessage}
            </Alert>
          </Expire>
        )}

        {/* If renderType is reply, render the related question that is being answered */}
        {renderType === 'reply' && reply && (
          <div>
            <div className="display-flex">
              <IconInitial user={reply.createdBy} index={0} />
              <span className="margin-left-2 margin-top-05 text-base">
                {getTimeElapsed(reply.createdDts)
                  ? getTimeElapsed(reply.createdDts) + t('ago')
                  : t('justNow')}
              </span>
            </div>
            <div className="margin-left-5">
              <p>{reply.content}</p>
            </div>
          </div>
        )}

        <Formik
          initialValues={{ content: '' }}
          onSubmit={handleCreateDiscussion}
          validationSchema={validationSchema}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(formikProps: FormikProps<DicussionFormPropTypes>) => {
            const { errors, setErrors, handleSubmit, dirty } = formikProps;
            const flatErrors = flattenErrors(errors);
            return (
              <>
                {Object.keys(errors).length > 0 && (
                  <ErrorAlert
                    testId="formik-validation-errors"
                    classNames="margin-top-3"
                    heading={h('checkAndFix')}
                  >
                    {Object.keys(flatErrors).map(key => {
                      return (
                        <ErrorAlertMessage
                          key={`Error.${key}`}
                          errorKey={key}
                          message={flatErrors[key]}
                        />
                      );
                    })}
                  </ErrorAlert>
                )}
                <Form
                  onSubmit={e => {
                    handleSubmit(e);
                    window.scrollTo(0, 0);
                  }}
                >
                  <FieldGroup
                    scrollElement="content"
                    error={!!flatErrors.content}
                  >
                    <Label htmlFor="discussion-content" className="text-normal">
                      {renderType === 'question'
                        ? t('typeQuestion')
                        : t('typeAnswer')}
                    </Label>
                    <FieldErrorMsg>{flatErrors.content}</FieldErrorMsg>
                    <Field
                      className="height-card"
                      as={Textarea}
                      error={!!flatErrors.content}
                      id="discussion-content"
                      name="content"
                    />
                  </FieldGroup>
                  <div className="margin-y-5 display-block">
                    <Button
                      className="usa-button usa-button--outline margin-bottom-1"
                      type="button"
                      onClick={() => {
                        if (discussionType) {
                          setDiscussionStatusMessage('');
                          setDiscussionType('discussion');
                        } else {
                          closeModal();
                        }
                      }}
                    >
                      {h('cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={!dirty}
                      onClick={() => setErrors({})}
                    >
                      {renderType === 'question' ? t('save') : t('saveAnswer')}
                    </Button>
                  </div>
                </Form>
              </>
            );
          }}
        </Formik>
      </>
    );
  };

  const discussionComponent = (
    discussion: DiscussionType | ReplyType,
    index: number,
    connected?: boolean,
    answerQuestion?: boolean
  ) => (
    <div className="mint-discussions__single-discussion" key={discussion.id}>
      <div className="display-flex">
        {discussion.isAssessment ? (
          <div className="display-flex flex-align-center">
            <AssessmentIcon size={3} />{' '}
            <span>
              {t('assessment')} | {discussion.createdBy}
            </span>
          </div>
        ) : (
          <IconInitial
            user={
              collaborators.find(
                collaborator => collaborator.euaUserID === discussion.createdBy
              )?.fullName || ''
            }
            index={index}
            className="margin-bottom-2"
          />
        )}
        <span className="margin-left-2 margin-top-05 text-base">
          {getTimeElapsed(discussion.createdDts)
            ? getTimeElapsed(discussion.createdDts) + t('ago')
            : t('justNow')}
        </span>
      </div>

      <div
        className={classNames({
          'margin-bottom-4': answerQuestion,
          'mint-discussions__connected': connected,
          'mint-discussions__not-connected': !connected
        })}
      >
        <p className="margin-y-0 padding-y-1">{discussion.content}</p>
        <div className="display-flex margin-bottom-2">
          {/* Rendered a link to answer a question if there are no replies/answers */}
          {answerQuestion && (
            <>
              <IconAnnouncement className="text-primary margin-right-1" />
              <Button
                type="button"
                unstyled
                role="button"
                onClick={() => {
                  setDiscussionStatusMessage('');
                  setDiscussionType('reply');
                  setReply(discussion);
                }}
              >
                {t('answer')}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const formatDiscussions = (
    discussionsContent: DiscussionType[],
    status: DiscussionStatus
  ) => {
    if (status === 'ANSWERED') {
      discussionsContent.sort(sortRepliesByDate); // Sort discusssions by the most recent reply for answered questions
    }

    return discussionsContent.map((discussion, index) => {
      return (
        <div
          key={discussion.id}
          className={classNames({
            'margin-top-4': index > 0,
            'margin-top-2': index === 0
          })}
        >
          {discussion.replies.length > 0 ? (
            // If discussions has replies, join together in array for rendering as a connected discussion
            <div>
              {[
                discussion,
                ...discussion.replies
              ].map((discussionReply: ReplyType | DiscussionType, replyIndex) =>
                discussionComponent(
                  discussionReply,
                  index,
                  replyIndex !== discussion.replies.length
                )
              )}
            </div>
          ) : (
            // Render only question if no replies
            discussionComponent(discussion, index, undefined, true)
          )}
          {/* Divider to separate questions if not the last question */}
          {index !== discussionsContent.length - 1 && (
            <Divider className="margin-top-4" />
          )}
        </div>
      );
    });
  };

  // Two main discussion accordion types - "Unanswered" and "Answered" based on enum - DiscussionStatus
  const discussionAccordion = (Object.keys(DiscussionStatus) as Array<
    keyof typeof DiscussionStatus
  >)
    .filter(status => status !== 'WAITING_FOR_RESPONSE') // Not currently using this status, but it exists for future possibility
    .reverse() // Unanswered questions should appear for answered.  This method of sorting may need to change if more status/accordions are introduced
    .map(status => {
      return (
        <div key={status}>
          <Accordion
            className={classNames('margin-bottom-2', {
              'no-pointer': !openStatus(DiscussionStatus[status]),
              'no-button': !openStatus(DiscussionStatus[status])
            })}
            key={status}
            multiselectable
            items={[
              {
                // Formatting of accordion headers based on number of questions and their pluraltiy
                title:
                  status === 'UNANSWERED' ? (
                    <strong>
                      {questionCount.unansweredQuestions} {t('unanswered')}
                      {questionCount.unansweredQuestions !== 1 && 's'}
                    </strong>
                  ) : (
                    <strong>
                      {questionCount.answeredQuestions} {t('answered')}
                      {questionCount.answeredQuestions !== 1 && 's'}
                    </strong>
                  ),
                content: formatDiscussions(
                  discussions.filter(
                    discussion => discussion.status === status
                  ),
                  DiscussionStatus[status]
                ),
                expanded: openStatus(DiscussionStatus[status]),
                id: status,
                headingLevel: 'h4'
              }
            ]}
          />
          {/* Sets an infobox beneath each accordion if there are zero questions of that type */}
          {!openStatus(DiscussionStatus[status]) && (
            <Alert className="margin-bottom-2" type="info">
              {status === 'ANSWERED' ? t('noAnswered') : t('noUanswered')}
            </Alert>
          )}
        </div>
      );
    });

  const renderDiscussions = () => {
    return (
      <>
        <PageHeading headingLevel="h1" className="margin-top-0">
          {t('heading')}
        </PageHeading>
        <div className="display-flex margin-bottom-4">
          <IconAnnouncement className="text-primary margin-right-1" />
          <Button
            type="button"
            unstyled
            onClick={() => {
              setReply(null); // Setting reply to null - indicates a new question rather than an answer to a question
              setDiscussionStatusMessage(''); // Clearing status before asking a new question
              setDiscussionType('question');
            }}
          >
            {t('askAQuestionLink')}
          </Button>
        </div>
        {/* General error message for mutations that expires after 3 seconds */}
        {discussionStatusMessage && (
          <Expire delay={3000} callback={setDiscussionStatusMessage}>
            <Alert type={discussionStatus} className="margin-bottom-4">
              {discussionStatusMessage}
            </Alert>
          </Expire>
        )}
        {/* Render error if failed to fetch discussions */}
        {error ? (
          <Alert type="error" className="margin-bottom-4">
            {t('errorFetch')}
          </Alert>
        ) : (
          discussionAccordion
        )}
      </>
    );
  };

  const chooseRenderMethod = () => {
    if (error || discussionType === 'discussion') {
      return renderDiscussions();
    }
    return renderQuestion(discussionType); // If discussionType === "question" or "reply"
  };

  return (
    <DiscussionModalWrapper
      modelID={modelID}
      isOpen={isOpen}
      closeModal={() => closeModal()}
    >
      {loading && !discussions ? (
        <PageLoading />
      ) : (
        <Grid desktop={{ col: 12 }}>{chooseRenderMethod()}</Grid>
      )}
    </DiscussionModalWrapper>
  );
};

export default Discussions;
