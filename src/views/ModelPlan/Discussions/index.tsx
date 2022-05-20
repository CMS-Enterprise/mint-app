import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { useMutation } from '@apollo/client';
import {
  Accordion,
  Button,
  Grid,
  GridContainer,
  IconAnnouncement,
  IconClose,
  Label,
  Textarea
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Field, Form, Formik, FormikProps } from 'formik';
import noScroll from 'no-scroll';
import * as Yup from 'yup';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import Expire from 'components/shared/Expire';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import IconInitial from 'components/shared/IconInitial';
import CreateModelPlanDiscussion from 'queries/CreateModelPlanDiscussion';
import CreateModelPlanReply from 'queries/CreateModelPlanReply';
import { CreateModelPlanDiscussion as CreateModelPlanDiscussionType } from 'queries/types/CreateModelPlanDiscussion';
import {
  CreateModelPlanReply as CreateModelPlanReplyType,
  CreateModelPlanReply_createDiscussionReply as ReplyType
} from 'queries/types/CreateModelPlanReply';
import { GetModelPlan_modelPlan_discussions as DiscussionType } from 'queries/types/GetModelPlan';
import { UpdateModelPlanDiscussion as UpdateModelPlanDiscussionType } from 'queries/types/UpdateModelPlanDiscussion';
import UpdateModelPlanDiscussion from 'queries/UpdateModelPlanDiscussion';
import { DiscussionStatus } from 'types/graphql-global-types';
import { getTimeElapsed } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import { getUnansweredQuestions, sortRepliesByDate } from 'utils/modelPlan';

import './index.scss';

type DiscussionsProps = {
  modelID: string;
  isOpen: boolean;
  discussions: DiscussionType[];
  refetch: () => any | undefined;
  openModal?: () => void;
  closeModal: () => void;
};

type DicussionFormPropTypes = {
  content: string;
};

const Discussions = ({
  modelID,
  isOpen,
  discussions,
  refetch,
  openModal,
  closeModal
}: DiscussionsProps) => {
  const { t } = useTranslation('discussions');
  const { t: h } = useTranslation('draftModelPlan');

  const [discussionStatus, setDiscussionStatus] = useState<'success' | 'error'>(
    'success'
  );

  const [discussionStatusMessage, setDiscussionStatusMessage] = useState('');

  const [questionCount, setQuestionCount] = useState({
    answeredQuestions: 0,
    unansweredQuestions: 0
  });

  const [discussionType, setDiscussionType] = useState<
    'question' | 'reply' | 'discussion'
  >('question');

  const [reply, setReply] = useState<DiscussionType | ReplyType | null>(null);

  const openStatus = (status: DiscussionStatus) => {
    if (status === 'ANSWERED') {
      return questionCount.answeredQuestions > 0;
    }
    return questionCount.unansweredQuestions > 0;
  };

  useEffect(() => {
    if (discussions?.length === 0) {
      setDiscussionType('question');
    } else {
      setDiscussionType('discussion');
    }
    setQuestionCount(getUnansweredQuestions(discussions));
  }, [discussions]);

  const [createQuestion] = useMutation<CreateModelPlanDiscussionType>(
    CreateModelPlanDiscussion
  );

  const [createReply] = useMutation<CreateModelPlanReplyType>(
    CreateModelPlanReply
  );

  const [updateDiscussion] = useMutation<UpdateModelPlanDiscussionType>(
    UpdateModelPlanDiscussion
  );

  const createDiscussions = {
    question: createQuestion,
    reply: createReply
  };

  const validationSchema = Yup.object().shape({
    content: Yup.string().trim().required(`Please enter a ${discussionType}`)
  });

  const handleOpenModal = () => {
    noScroll.on();
    if (openModal) {
      openModal();
    }
  };

  const handleCreateDiscussion = (formikValues: DicussionFormPropTypes) => {
    let payload = {};

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

    createDiscussions[discussionType]({
      variables: {
        input: payload
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (discussionType === 'reply' && reply?.id) {
            handleUpdateDiscussion(reply.id);
          }
          setDiscussionStatus('success');
          setDiscussionStatusMessage(
            discussionType === 'question' ? t('success') : t('successAnswer')
          );
          refetch().then(() => {
            setDiscussionType('discussion');
          });
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
          status: 'ANSWERED'
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          refetch().then(() => {
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
        {discussionStatusMessage && (
          <Expire delay={3000} callback={setDiscussionStatusMessage}>
            <Alert className="margin-bottom-4" type={discussionStatus}>
              {discussionStatusMessage}
            </Alert>
          </Expire>
        )}
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
                      className="usa-button usa-button--outline"
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
    askQuestion?: boolean
  ) => (
    <div key={discussion.id}>
      <div className="display-flex">
        <IconInitial user={discussion.createdBy} index={index} />
        <span className="margin-left-2 margin-top-05 text-base">
          {getTimeElapsed(discussion.createdDts)
            ? getTimeElapsed(discussion.createdDts) + t('ago')
            : t('justNow')}
        </span>
      </div>

      <div
        className={classNames({
          'mint-discussions__connected margin-left-105 padding-left-3': connected,
          'padding-left-5': !connected
        })}
      >
        {' '}
        <p>{discussion.content}</p>
        <div className="display-flex margin-bottom-2">
          {askQuestion && (
            <>
              {' '}
              <IconAnnouncement className="text-primary margin-right-1" />
              <Button
                type="button"
                unstyled
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
      discussionsContent.sort(sortRepliesByDate);
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
            discussionComponent(discussion, index, undefined, true)
          )}
          {index !== discussionsContent.length - 1 && <Divider />}
        </div>
      );
    });
  };

  const discussionAccordion = (Object.keys(DiscussionStatus) as Array<
    keyof typeof DiscussionStatus
  >)
    .filter(status => status !== 'WAITING_FOR_RESPONSE') // Not currently using this status, but it exists for future possibility
    .reverse() // Unanswered questions should appear for answered.  This method of sorting may need to change if more status/accordions are introduced
    .map(status => {
      return (
        <div key={status}>
          <Accordion
            key={status}
            multiselectable
            items={[
              {
                title:
                  status === 'UNANSWERED' ? (
                    <strong>
                      {questionCount.unansweredQuestions} {t('unanswered')}
                      {questionCount.unansweredQuestions > 1 && 's'}
                    </strong>
                  ) : (
                    <strong>
                      {questionCount.answeredQuestions} {t('answered')}
                      {questionCount.answeredQuestions > 1 && 's'}
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
              setReply(null);
              setDiscussionStatusMessage('');
              setDiscussionType('question');
            }}
          >
            {t('askAQuestionLink')}
          </Button>
        </div>
        {discussionStatusMessage && (
          <Expire delay={3000} callback={setDiscussionStatusMessage}>
            <Alert type={discussionStatus} className="margin-bottom-4">
              {discussionStatusMessage}
            </Alert>
          </Expire>
        )}
        {discussionAccordion}
      </>
    );
  };

  const chooseRenderMethod = () => {
    if (discussionType === 'question' || discussionType === 'reply') {
      return renderQuestion(discussionType);
    }
    return renderDiscussions();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="mint-discussions__overlay overflow-y-scroll"
      className="mint-discussions__content"
      onAfterOpen={handleOpenModal}
      onAfterClose={noScroll.off}
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick
      appElement={document.getElementById('root')!}
    >
      <div className="mint-discussions__x-button-container display-flex text-base flex-align-center">
        <button
          type="button"
          className="mint-discussions__x-button margin-right-2"
          aria-label="Close Modal"
          onClick={closeModal}
        >
          <IconClose size={4} className="text-base" />
        </button>
        <h4 className="margin-0">{t('modalHeading')}</h4>
      </div>
      <GridContainer className="padding-y-8">
        <Grid desktop={{ col: 12 }}>{chooseRenderMethod()}</Grid>
      </GridContainer>
    </ReactModal>
  );
};

export default Discussions;
