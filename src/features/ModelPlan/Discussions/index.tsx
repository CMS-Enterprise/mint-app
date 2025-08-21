import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Accordion, Button, Grid, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  DiscussionUserRole,
  GetModelPlanDiscussionsQuery,
  PlanDiscussionCreateInput,
  useCreateModelPlanDiscussionMutation,
  useCreateModelPlanReplyMutation,
  useGetModelPlanDiscussionsQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import toastSuccess from 'components/ToastSuccess';
import { useErrorMessage } from 'contexts/ErrorContext';

import DiscussionModalWrapper from './DiscussionModalWrapper';
import FormatDiscussion from './FormatDiscussion';
import QuestionAndReply from './QuestionAndReply';

import './index.scss';

type DiscussionType =
  GetModelPlanDiscussionsQuery['modelPlan']['discussions'][0];
type ReplyType =
  GetModelPlanDiscussionsQuery['modelPlan']['discussions'][0]['replies'][0];

export type DiscussionsProps = {
  modelID: string;
  discussionID?: string | null;
  readOnly?: boolean;
  askAQuestion?: boolean;
};

export type DiscussionFormPropTypes = Omit<
  PlanDiscussionCreateInput,
  'modelPlanID'
>;

const Discussions = ({
  modelID,
  discussionID,
  askAQuestion,
  readOnly
}: DiscussionsProps) => {
  const { t: discussionsMiscT } = useTranslation('discussionsMisc');
  const { setErrorMeta } = useErrorMessage();

  // Used to replace query params after reply has been asnwered from linked email
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location.search]);

  const { data, loading, error, refetch } = useGetModelPlanDiscussionsQuery({
    variables: {
      id: modelID
    }
  });

  const discussions = useMemo(() => {
    return (data?.modelPlan?.discussions || []) as DiscussionType[];
  }, [data?.modelPlan?.discussions]);

  const [createQuestion] = useCreateModelPlanDiscussionMutation();

  const [createReply] = useCreateModelPlanReplyMutation();

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

  // State used to control when the component is being rendered from a form page rather than the task-list
  const [initQuestion, setInitQuestion] = useState<boolean | undefined>(
    discussionReplyID ? true : askAQuestion
  );

  // State and setter used for containing the related question when replying
  const [reply, setReply] = useState<DiscussionType | ReplyType | null>(null);

  // Hook used to open reply form if discussionID present
  useEffect(() => {
    const discussionToReply = discussions.find(
      dis => dis.id === discussionReplyID
    );

    if (discussionToReply && !loading && discussions.length) {
      setIsDiscussionOpen(true);
      setDiscussionType('reply');
      setReply(discussionToReply);
    }
  }, [discussionReplyID, discussions, loading]);

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

  const handleCreateDiscussion = (formikValues: DiscussionFormPropTypes) => {
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

    setErrorMeta({
      overrideMessage:
        discussionType === 'question'
          ? discussionsMiscT('error')
          : discussionsMiscT('errorReply')
    });

    createDiscussionMethods[discussionType]({
      variables: {
        input: payload
      }
    }).then(response => {
      if (!response?.errors) {
        if (discussionType === 'reply' && reply?.id) {
          setDiscussionReplyID(null);
          queryParams.delete('discussionID');
          navigate(
            {
              search: queryParams.toString()
            },
            {
              replace: true
            }
          );
          refetch().then(() => {
            setInitQuestion(false);
            setDiscussionType('discussion');
          });
        } else {
          refetch().then(() => {
            setInitQuestion(false);
            setDiscussionType('discussion');
          });
        }

        if (readOnly) {
          setIsDiscussionOpen(false);
        }

        toastSuccess(
          discussionType === 'question'
            ? discussionsMiscT('success')
            : discussionsMiscT('successReply'),
          {
            position: 'top-right'
          }
        );
      }
    });
  };

  const DiscussionAccordion = ({
    discussionContent,
    hasReplies
  }: {
    discussionContent: DiscussionType[];
    hasReplies?: boolean;
  }) => {
    return (
      <>
        <Accordion
          className={classNames(
            'discussion-accordion margin-bottom-2 margin-top-0',
            {
              'no-pointer': discussionContent.length === 0,
              'no-button': discussionContent.length === 0
            }
          )}
          bordered={false}
          multiselectable
          items={[
            {
              title: (
                <strong>
                  {hasReplies
                    ? discussionsMiscT('discussionWithCount', {
                        count: discussionContent.length
                      })
                    : discussionsMiscT('newDiscussionTopics', {
                        count: discussionContent.length
                      })}
                </strong>
              ),
              content: (
                <FormatDiscussion
                  discussionsContent={discussionContent}
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
        {discussionContent.length === 0 && (
          <Alert className="margin-bottom-2" type="info">
            {hasReplies
              ? discussionsMiscT('noAnswered')
              : discussionsMiscT('noUanswered')}
          </Alert>
        )}
      </>
    );
  };

  const renderDiscussionContent = () => {
    if (discussions.length === 0) {
      return (
        <Alert className="margin-bottom-2" type="info">
          {discussionsMiscT('useLinkAbove')}
        </Alert>
      );
    }

    const discussionsWithNoReplies = discussions.filter(
      d => d.replies.length === 0
    );
    const discussionsWithYesReplies = discussions.filter(
      d => d.replies.length !== 0
    );

    return (
      <>
        <DiscussionAccordion discussionContent={discussionsWithNoReplies} />
        <DiscussionAccordion
          discussionContent={discussionsWithYesReplies}
          hasReplies
        />
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
          {discussionsMiscT('heading')}
        </PageHeading>

        <div className="display-flex margin-bottom-4">
          <Icon.Announcement
            className="text-primary margin-right-1"
            aria-label="announcement"
          />
          <Button
            type="button"
            unstyled
            onClick={() => {
              if (readOnly) {
                setIsDiscussionOpen(true);
                setDiscussionType('question');
              } else {
                setReply(null); // Setting reply to null - indicates a new question rather than an answer to a question
                setDiscussionType('question');
              }
            }}
          >
            {discussionsMiscT('askAQuestionLink')}
          </Button>
        </div>

        {/* Render error if failed to fetch discussions */}
        {error ? (
          <Alert type="error" className="margin-bottom-4">
            {discussionsMiscT('errorFetch')}
          </Alert>
        ) : (
          renderDiscussionContent()
        )}
      </>
    );
  };

  const chooseRenderMethod = () => {
    if (loading && !data) return <PageLoading />;
    if (readOnly || error || discussionType === 'discussion') {
      return renderDiscussions();
    }
    // If discussionType === "question" or "reply"
    return (
      <>
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
      </>
    );
  };

  return (
    <>
      {!data && loading ? (
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
                <>
                  <QuestionAndReply
                    renderType={discussionType}
                    discussionReplyID={discussionReplyID}
                    closeModal={() => setIsDiscussionOpen(false)}
                    handleCreateDiscussion={handleCreateDiscussion}
                    reply={reply}
                  />
                </>
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
