import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import {
  Accordion,
  Alert,
  Button,
  Grid,
  IconAnnouncement
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Expire from 'components/shared/Expire';
import CreateModelPlanReply from 'queries/CreateModelPlanReply';
import CreateModelPlanDiscussion from 'queries/Discussions/CreateModelPlanDiscussion';
import GetModelPlanDiscussions from 'queries/Discussions/GetModelPlanDiscussions';
import { CreateModelPlanDiscussion as CreateModelPlanDiscussionType } from 'queries/Discussions/types/CreateModelPlanDiscussion';
import {
  GetModelPlanDiscussions as GetModelPlanDiscussionsType,
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType,
  GetModelPlanDiscussionsVariables
} from 'queries/Discussions/types/GetModelPlanDiscussions';
// import Discussions from 'views/ModelPlan/Discussions';
import { UpdateModelPlanDiscussion as UpdateModelPlanDiscussionType } from 'queries/Discussions/types/UpdateModelPlanDiscussion';
import UpdateModelPlanDiscussion from 'queries/Discussions/UpdateModelPlanDiscussion';
import { CreateModelPlanReply as CreateModelPlanReplyType } from 'queries/types/CreateModelPlanReply';
import { DiscussionStatus } from 'types/graphql-global-types';
import { getUnansweredQuestions } from 'utils/modelPlan';
import { isAssessment, isMAC } from 'utils/user';
import DiscussionModalWrapper from 'views/ModelPlan/Discussions/DiscussionModalWrapper';
import FormatDiscussion from 'views/ModelPlan/Discussions/FormatDiscussion';

import QuestionAndReply from './_components/QuestionAndReply';

const ReadOnlyDiscussions = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('discussions');

  const { data, loading, error, refetch } = useQuery<
    GetModelPlanDiscussionsType,
    GetModelPlanDiscussionsVariables
  >(GetModelPlanDiscussions, {
    variables: {
      id: modelID
    }
  });

  // Mutations
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

  // Determine if User has edit access
  const flags = useFlags();
  const { groups } = useSelector((state: RootStateOrAny) => state.auth);
  const isCollaborator = data?.modelPlan?.isCollaborator;
  const hasEditAccess: boolean =
    (isCollaborator || isAssessment(groups, flags)) && !isMAC(groups);

  // State Management below
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
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
  // State and setter used for containing the related question when replying
  const [reply, setReply] = useState<DiscussionType | ReplyType | null>(null);

  // Handles the default expanded render of accordions based on if there are more than zero questions
  const openStatus = (status: DiscussionStatus) => {
    return status === 'ANSWERED'
      ? questionCount.answeredQuestions > 0
      : questionCount.unansweredQuestions > 0;
  };

  const discussions = useMemo(() => {
    return data?.modelPlan?.discussions || ([] as DiscussionType[]);
  }, [data?.modelPlan?.discussions]);

  useEffect(() => {
    setQuestionCount(getUnansweredQuestions(discussions));
  }, [discussions]);

  // Formik Form Submission Handler
  const handleCreateDiscussion = (formikValues: { content: string }) => {
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
          }

          setIsDiscussionOpen(false);
          setDiscussionStatus('success');
          setDiscussionStatusMessage(
            discussionType === 'question' ? t('success') : t('successAnswer')
          );
          refetch();
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
          setIsDiscussionOpen(false);
          setDiscussionStatus('success');
          setDiscussionStatusMessage(
            discussionType === 'question' ? t('success') : t('successAnswer')
          );
          refetch();
        }
      })
      .catch(() => {
        setDiscussionStatus('error');
        setDiscussionStatusMessage(t('error'));
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
                content: (
                  <FormatDiscussion
                    discussionsContent={discussions.filter(
                      discussion => discussion.status === status
                    )}
                    status={DiscussionStatus[status]}
                    hasEditAccess={hasEditAccess}
                    setDiscussionStatusMessage={setDiscussionStatusMessage}
                    setDiscussionType={setDiscussionType}
                    setReply={setReply}
                    setIsDiscussionOpen={setIsDiscussionOpen}
                  />
                ),
                expanded: true,
                id: status,
                headingLevel: 'h4'
              }
            ]}
          />
          {/* Sets an infobox beneath each accordion if there are zero questions of that type */}
          {!openStatus(DiscussionStatus[status]) && (
            <Alert className="margin-bottom-2" type="info">
              {hasEditAccess &&
                (status === 'ANSWERED' ? t('noAnswered') : t('noUanswered'))}
              {!hasEditAccess &&
                (status === 'ANSWERED'
                  ? t('noAnswered')
                  : t('nonEditor.noQuestions'))}
            </Alert>
          )}
        </div>
      );
    });

  const renderDiscussionContent = () => {
    if (discussions?.length === 0) {
      return (
        <Alert className="margin-bottom-2" type="info">
          {hasEditAccess ? t('useLinkAbove') : t('nonEditor.noDiscussions')}
        </Alert>
      );
    }
    return discussionAccordion;
  };

  return (
    <div
      className="read-only-model-plan--discussions"
      data-testid="read-only-model-plan--discussions"
    >
      {/* Discussion modal */}
      {isDiscussionOpen && (
        <DiscussionModalWrapper
          isOpen={isDiscussionOpen}
          closeModal={() => setIsDiscussionOpen(false)}
        >
          {discussionType !== 'discussion' && (
            <QuestionAndReply
              renderType={discussionType}
              closeModal={() => setIsDiscussionOpen(false)}
              handleCreateDiscussion={handleCreateDiscussion}
              reply={reply}
            />
          )}
        </DiscussionModalWrapper>
      )}

      {loading && !discussions ? (
        <PageLoading />
      ) : (
        <Grid desktop={{ col: 12 }}>
          <PageHeading headingLevel="h2" className="margin-top-0">
            {t('heading')}
          </PageHeading>

          {/* Ask a Question link available to Collaborators and Assessment Users */}
          {hasEditAccess && (
            <div className="display-flex margin-bottom-4">
              <IconAnnouncement className="text-primary margin-right-1" />
              <Button
                type="button"
                unstyled
                onClick={() => {
                  // TODO: Opens Modal here
                  setIsDiscussionOpen(true);
                  // setReply(null); // Setting reply to null - indicates a new question rather than an answer to a question
                  // setDiscussionStatusMessage(''); // Clearing status before asking a new question
                  // setDiscussionType('question');
                }}
              >
                {t('askAQuestionLink')}
              </Button>
            </div>
          )}

          {/* General error message for mutations that expires after 3 seconds */}
          {discussionStatusMessage && (
            <Expire delay={45000} callback={setDiscussionStatusMessage}>
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
            renderDiscussionContent()
          )}
        </Grid>
      )}
    </div>
  );
};

export default ReadOnlyDiscussions;
