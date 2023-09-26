import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Accordion,
  Button,
  Grid,
  IconAnnouncement
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
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
import { UpdateModelPlanDiscussion as UpdateModelPlanDiscussionType } from 'queries/Discussions/types/UpdateModelPlanDiscussion';
import UpdateModelPlanDiscussion from 'queries/Discussions/UpdateModelPlanDiscussion';
import { CreateModelPlanReply as CreateModelPlanReplyType } from 'queries/types/CreateModelPlanReply';
import {
  DiscussionUserRole,
  PlanDiscussionCreateInput
} from 'types/graphql-global-types';
import { isAssessment, isMAC } from 'utils/user';

import DiscussionModalWrapper from './DiscussionModalWrapper';
import FormatDiscussion from './FormatDiscussion';
import QuestionAndReply from './QuestionAndReply';

import './index.scss';

export type DiscussionsProps = {
  modelID: string;
  discussionID?: string | null;
  readOnly?: boolean;
  askAQuestion?: boolean;
};

export type DicussionFormPropTypes = Omit<
  PlanDiscussionCreateInput,
  'modelPlanID'
>;

const Discussions = ({
  modelID,
  discussionID,
  askAQuestion,
  readOnly
}: DiscussionsProps) => {
  const { t } = useTranslation('discussions');

  // Used to replace query params after reply has been asnwered from linked email
  const location = useLocation();
  const history = useHistory();

  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const { data, loading, error, refetch } = useQuery<
    GetModelPlanDiscussionsType,
    GetModelPlanDiscussionsVariables
  >(GetModelPlanDiscussions, {
    variables: {
      id: modelID
    }
  });

  const flags = useFlags();

  const { groups } = useSelector((state: RootStateOrAny) => state.auth);
  const isCollaborator = data?.modelPlan?.isCollaborator;
  const hasEditAccess: boolean =
    isCollaborator || isAssessment(groups, flags) || isMAC(groups);

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

  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [discussionReplyID, setDiscussionReplyID] = useState<
    string | null | undefined
  >(discussionID);

  const [discussionType, setDiscussionType] = useState<
    'question' | 'reply' | 'discussion'
  >(discussionReplyID ? 'reply' : 'question');

  const [discussionStatusMessage, setDiscussionStatusMessage] = useState('');

  // State used to control when the component is being rendered from a form page rather than the task-list
  const [initQuestion, setInitQuestion] = useState<boolean | undefined>(
    discussionReplyID ? true : askAQuestion
  );

  // State and setter used for containing the related question when replying
  const [reply, setReply] = useState<DiscussionType | ReplyType | null>(null);

  // State used to manage alert rendering
  const [alertClosed, closeAlert] = useState<boolean | null>(false);

  // Hook used to open reply form if discussionID present
  useEffect(() => {
    const discussionToReply = discussions.find(
      dis => dis.id === discussionReplyID
    );

    if (discussionToReply && !loading) {
      if (discussionToReply.replies.length === 0) {
        setReply(discussionToReply);
      } else {
        setDiscussionReplyID(null);
        queryParams.delete('discussionID');
        history.replace({
          search: queryParams.toString()
        });
        setInitQuestion(false);
        setDiscussionStatusMessage(
          t('alreadyAnswered', {
            question: discussionToReply.content
          })
        );
      }
    }
  }, [discussionReplyID, discussions, loading, queryParams, history, t]);

  // Hook used to conditionally render each discussionType by its setter method
  useEffect(() => {
    if (discussions?.length > 0 && discussionReplyID) {
      setDiscussionType('reply');
    } else if ((discussions?.length === 0 || initQuestion) && !readOnly) {
      setDiscussionType('question');
    } else {
      setDiscussionType('discussion');
    }
  }, [discussions, initQuestion, readOnly, discussionReplyID]);

  const handleCreateDiscussion = (formikValues: DicussionFormPropTypes) => {
    let payload: any = {};

    // Setting the mutation payload depending on discussionType
    if (discussionType === 'question') {
      payload = {
        modelPlanID: modelID,
        ...formikValues
      };
    } else if (discussionType === 'reply' && reply) {
      payload = {
        discussionID: reply.id,
        ...formikValues
      };
    } else {
      return; // Currently we have no mutations when discussions is displayed
    }

    if (payload.userRole !== DiscussionUserRole.NONE_OF_THE_ABOVE)
      payload.userRoleDescription = null;

    createDiscussionMethods[discussionType]({
      variables: {
        input: payload
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (discussionType === 'reply' && reply?.id) {
            setDiscussionReplyID(null);
            queryParams.delete('discussionID');
            history.replace({
              search: queryParams.toString()
            });
            handleUpdateDiscussion(reply.id);
          } else {
            refetch().then(() => {
              setInitQuestion(false);
              setDiscussionType('discussion');
            });
          }

          if (readOnly) {
            setIsDiscussionOpen(false);
          }
          // setDiscussionStatus('success');
          setDiscussionStatusMessage(
            discussionType === 'question' ? t('success') : t('successReply')
          );
        }
      })
      .catch(() => {
        // setDiscussionStatus('error');
        setDiscussionStatusMessage(
          discussionType === 'question' ? t('error') : t('errorReply')
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
        // setDiscussionStatus('error');
        setDiscussionStatusMessage(t('error'));
      });
  };

  const renderDiscussionContent = () => {
    if (discussions.length === 0) {
      return (
        <Alert className="margin-bottom-2" type="info">
          {hasEditAccess ? t('useLinkAbove') : t('nonEditor.noDiscussions')}
        </Alert>
      );
    }

    const discussionsWithNoReplies = discussions.filter(
      d => d.replies.length === 0
    );
    const discussionsWithYesReplies = discussions.filter(
      d => d.replies.length > 0
    );

    return (
      <>
        <Accordion
          className={classNames(
            'discussion-accordion margin-bottom-2 margin-top-0',
            {
              'no-pointer': discussionsWithNoReplies.length === 0,
              'no-button': discussionsWithNoReplies.length === 0
            }
          )}
          bordered={false}
          multiselectable
          items={[
            {
              title: (
                <strong>
                  {t('newDiscussionTopics', {
                    count: discussionsWithNoReplies.length
                  })}
                </strong>
              ),
              content: (
                <FormatDiscussion
                  discussionsContent={discussionsWithNoReplies}
                  setDiscussionType={setDiscussionType}
                  setReply={setReply}
                  setIsDiscussionOpen={setIsDiscussionOpen}
                />
              ),
              expanded: true,
              id: 'discussion-accordion--hasNoReplies',
              headingLevel: 'h4'
            }
          ]}
        />

        {discussionsWithNoReplies.length === 0 && (
          <Alert className="margin-bottom-2" type="info">
            {t('noUanswered')}
          </Alert>
        )}
        <Accordion
          className={classNames(
            'discussion-accordion margin-bottom-2 margin-top-0',
            {
              'no-pointer': discussionsWithYesReplies.length === 0,
              'no-button': discussionsWithYesReplies.length === 0
            }
          )}
          bordered={false}
          multiselectable
          items={[
            {
              title: (
                <strong>
                  {t('discussionWithCount', {
                    count: discussionsWithYesReplies.length
                  })}
                </strong>
              ),
              content: (
                <FormatDiscussion
                  discussionsContent={discussionsWithYesReplies}
                  setDiscussionType={setDiscussionType}
                  setReply={setReply}
                  setIsDiscussionOpen={setIsDiscussionOpen}
                />
              ),
              expanded: true,
              id: 'discussion-accordion--hasReplies',
              headingLevel: 'h4'
            }
          ]}
        />
        {discussionsWithYesReplies.length === 0 && (
          <Alert className="margin-bottom-2" type="info">
            {t('noAnswered')}
          </Alert>
        )}
      </>
    );
  };

  const renderDiscussions = () => {
    return (
      <>
        <PageHeading
          headingLevel={readOnly ? 'h2' : 'h1'}
          className="margin-top-0 line-height-sans-2 margin-bottom-1"
        >
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
                if (readOnly) {
                  setIsDiscussionOpen(true);
                  setDiscussionType('question');
                } else {
                  setReply(null); // Setting reply to null - indicates a new question rather than an answer to a question
                  setDiscussionStatusMessage(''); // Clearing status before asking a new question
                  setDiscussionType('question');
                }
              }}
            >
              {t('askAQuestionLink')}
            </Button>
          </div>
        )}

        {/* General error message for mutations that expires after 45 seconds */}
        {discussionStatusMessage && !alertClosed && (
          <Expire delay={45000} callback={setDiscussionStatusMessage}>
            <Alert
              type="success"
              className="margin-bottom-4"
              closeAlert={closeAlert}
            >
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
      </>
    );
  };

  const chooseRenderMethod = () => {
    if (readOnly || error || discussionType === 'discussion') {
      return renderDiscussions();
    }
    // If discussionType === "question" or "reply"
    return (
      <QuestionAndReply
        renderType={discussionType}
        handleCreateDiscussion={handleCreateDiscussion}
        reply={reply}
        discussionReplyID={discussionReplyID}
        setDiscussionReplyID={setDiscussionReplyID}
        queryParams={queryParams}
        setInitQuestion={setInitQuestion}
        setDiscussionType={setDiscussionType}
      />
    );
  };

  return (
    <>
      {loading && !discussions ? (
        <PageLoading />
      ) : (
        <Grid desktop={{ col: 12 }}>
          {/* Discussion modal to show only in Read Only Discussion Page */}
          {readOnly && isDiscussionOpen && (
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
          {chooseRenderMethod()}
        </Grid>
      )}
    </>
  );
};

export default Discussions;
