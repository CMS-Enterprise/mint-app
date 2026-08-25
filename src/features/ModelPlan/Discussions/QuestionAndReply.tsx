import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Form, useNavigate } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Label,
  Select,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Formik, FormikProps } from 'formik';
import {
  DiscussionTopicType,
  DiscussionUserRole,
  GetModelPlanDiscussionsQuery,
  useGetMostRecentRoleSelectionQuery
} from 'gql/generated/graphql';

import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import MentionTextArea from 'components/MentionTextArea';
import PageHeading from 'components/PageHeading';
import RequiredAsterisk from 'components/RequiredAsterisk';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';

import DiscussionUserInfo from './_components/DiscussionUserInfo';
import { DISCUSSION_TOPICS_HIDDEN_FROM_UI } from './discussionTopicConstants';
import {
  getDiscussionFormValidationErrors,
  isDiscussionFormSubmittable
} from './isDiscussionFormSubmittable';
import Replies from './Replies';
import { DiscussionFormPropTypes } from '.';

type DiscussionType =
  GetModelPlanDiscussionsQuery['modelPlan']['discussions'][0];

type QuestionAndReplyProps = {
  closeModal?: () => void;
  discussionReplyID?: string | null | undefined;
  handleCreateDiscussion: (formikValues: DiscussionFormPropTypes) => void;
  queryParams?: URLSearchParams;
  renderType: 'question' | 'reply';
  reply?: DiscussionType | null;
  parentDiscussionTopic?: DiscussionTopicType;
  setDiscussionReplyID?: (value: string | null | undefined) => void;
  setDiscussionType?: (value: 'question' | 'reply' | 'discussion') => void;
  setInitQuestion?: (value: boolean) => void;
  defaultTopic?: DiscussionTopicType;
};

const QuestionAndReply = ({
  closeModal,
  discussionReplyID,
  handleCreateDiscussion,
  queryParams,
  renderType,
  reply,
  parentDiscussionTopic,
  setDiscussionReplyID,
  setDiscussionType,
  setInitQuestion,
  defaultTopic
}: QuestionAndReplyProps) => {
  const { t: discussionsT } = useTranslation('discussions');
  const { t: discussionsMiscT } = useTranslation('discussionsMisc');
  const { t: repliesT } = useTranslation('replies');
  const { t: h } = useTranslation('general');

  const { userRole: userRoleConfig, topic: topicConfig } =
    usePlanTranslation('discussions');

  const navigate = useNavigate();

  const { data, loading, error } = useGetMostRecentRoleSelectionQuery();

  const mostRecentUserRole = data?.mostRecentDiscussionRoleSelection?.userRole;
  const mostRecentUserRoleDescription =
    data?.mostRecentDiscussionRoleSelection?.userRoleDescription;

  // Cast to any to avoid type errors. This is a common pattern for resolving React 19 compatibility issues with third-party libraries that haven't been updated yet.
  const MINTForm = Form as any;

  return (
    <>
      <PageHeading
        headingLevel="h1"
        className="margin-top-0 margin-bottom-3 line-height-sans-2"
      >
        {renderType === 'question'
          ? discussionsMiscT('discussionPanelHeading')
          : discussionsMiscT('discussionPanelReply')}
      </PageHeading>

      {renderType === 'question' && (
        <>
          <p className="margin-bottom-2">{discussionsMiscT('description')}</p>
          <p className="margin-bottom-5">
            <Trans
              i18nKey={discussionsMiscT('allFieldsRequired')}
              components={{
                s: <span className="text-secondary-dark" />
              }}
            />
          </p>
        </>
      )}

      {/* If renderType is reply, render the related question that is being answered */}
      {renderType === 'reply' && reply && (
        <>
          <div className="discussion-topic margin-bottom-3">
            <DiscussionUserInfo discussionTopic={reply} />

            <div className="margin-left-5">
              {parentDiscussionTopic && (
                <p className="margin-top-1 margin-bottom-0 text-base">
                  {discussionsMiscT('topicReadOnly', {
                    topic: topicConfig.options[parentDiscussionTopic]
                  })}
                </p>
              )}
              <MentionTextArea
                id={`mention-${discussionReplyID}`}
                editable={false}
                initialContent={reply.content?.rawContent}
              />
            </div>
          </div>

          <Replies
            originalDiscussion={reply}
            discussionReplyID={discussionReplyID}
          />

          <PageHeading
            headingLevel="h2"
            className="margin-top-4 margin-bottom-1 line-height-sans-2"
          >
            {discussionsMiscT('reply')}
          </PageHeading>

          <p className="margin-top-0 margin-bottom-3">
            <Trans
              i18nKey={discussionsMiscT('allFieldsRequired')}
              components={{
                s: <span className="text-secondary-dark" />
              }}
            />
          </p>
        </>
      )}

      <Formik
        initialValues={{
          content: '',
          topic: defaultTopic,
          userRole: mostRecentUserRole || ('' as DiscussionUserRole),
          userRoleDescription: mostRecentUserRoleDescription || ''
        }}
        enableReinitialize
        onSubmit={handleCreateDiscussion}
        validate={values =>
          getDiscussionFormValidationErrors(values, renderType)
        }
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
      >
        {/* Formik types conflict with React 19 types */}
        {/* @ts-ignore */}
        {(formikProps: FormikProps<DiscussionFormPropTypes>) => {
          const {
            errors,
            values,
            setErrors,
            handleSubmit,
            setFieldValue,
            isSubmitting
          } = formikProps;
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
              <MINTForm
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <FieldGroup
                    scrollElement="user-role"
                    error={!!flatErrors.userRole}
                    className="margin-top-0"
                  >
                    <Label htmlFor="user-role">
                      {discussionsT('userRole.label')}
                      <RequiredAsterisk />
                    </Label>

                    <p className="text-base margin-top-0">
                      {discussionsT('userRole.sublabel')}
                    </p>

                    <FieldErrorMsg>{flatErrors.userRole}</FieldErrorMsg>

                    <Field
                      as={Select}
                      id="user-role"
                      name="userRole"
                      disabled={loading}
                      value={values.userRole || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('userRole', e.target.value);
                      }}
                    >
                      <option key="default-select" disabled value="">
                        {`-${discussionsMiscT('select')}-`}
                      </option>

                      {getKeys(userRoleConfig.options).map(role => {
                        return (
                          <option key={role} value={role}>
                            {userRoleConfig.options[role]}
                          </option>
                        );
                      })}
                    </Field>

                    {values.userRole ===
                      DiscussionUserRole.NONE_OF_THE_ABOVE && (
                      <div className="margin-top-3">
                        <Label
                          htmlFor="user-role-description"
                          className="text-normal"
                        >
                          {discussionsT('userRoleDescription.label')}
                          <RequiredAsterisk />
                        </Label>

                        <FieldErrorMsg>
                          {flatErrors.userRoleDescription}
                        </FieldErrorMsg>

                        <Field
                          as={TextInput}
                          value={values.userRoleDescription || ''}
                          id="user-role-description"
                          name="userRoleDescription"
                        />
                      </div>
                    )}
                  </FieldGroup>

                  {renderType === 'question' && (
                    <FieldGroup
                      scrollElement="discussion-topic"
                      error={!!flatErrors.topic}
                    >
                      <Label htmlFor="discussion-topic" className="text-normal">
                        {discussionsT('topic.label')}
                        <RequiredAsterisk />
                      </Label>

                      <p className="margin-top-0 text-base">
                        {discussionsT('topic.sublabel')}
                      </p>

                      <FieldErrorMsg>{flatErrors.topic}</FieldErrorMsg>

                      <Field
                        as={Select}
                        id="discussion-topic"
                        name="topic"
                        disabled={loading}
                        value={values.topic || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue('topic', e.target.value);
                        }}
                      >
                        <option key="default-select" disabled value="">
                          {`-${discussionsMiscT('select')}-`}
                        </option>

                        {getKeys(topicConfig.options)
                          .filter(
                            topic =>
                              !DISCUSSION_TOPICS_HIDDEN_FROM_UI.includes(topic)
                          )
                          .map(topic => {
                            return (
                              <option key={topic} value={topic}>
                                {topicConfig.options[topic]}
                              </option>
                            );
                          })}
                      </Field>
                    </FieldGroup>
                  )}

                  <FieldGroup
                    scrollElement="content"
                    error={!!flatErrors.content}
                  >
                    <Label
                      htmlFor="discussion-content"
                      className="text-normal margin-bottom-1"
                    >
                      {renderType === 'question'
                        ? discussionsT('content.label')
                        : repliesT('content.label')}
                      <RequiredAsterisk />
                    </Label>

                    <p className="margin-top-0 text-base">
                      {discussionsT('content.sublabel')}
                    </p>

                    <FieldErrorMsg>{flatErrors.content}</FieldErrorMsg>

                    <MentionTextArea
                      id="mention-editor"
                      setFieldValue={setFieldValue}
                      editable
                      disabled={loading}
                    />
                  </FieldGroup>

                  <div className="margin-y-5 display-block">
                    <Button
                      className="usa-button usa-button--outline margin-bottom-1"
                      type="button"
                      onClick={() => {
                        if (closeModal) {
                          closeModal();
                        }
                        if (
                          discussionReplyID &&
                          setDiscussionReplyID &&
                          queryParams &&
                          setInitQuestion
                        ) {
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
                          setInitQuestion(false);
                        }
                        if (renderType && setDiscussionType) {
                          setDiscussionType('discussion');
                        }
                      }}
                    >
                      {h('cancel')}
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting ||
                        !isDiscussionFormSubmittable(values, renderType)
                      }
                      onClick={() => setErrors({})}
                    >
                      {renderType === 'question'
                        ? discussionsMiscT('save')
                        : discussionsMiscT('saveReply')}
                    </Button>
                  </div>
                </Fieldset>
              </MINTForm>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default QuestionAndReply;
