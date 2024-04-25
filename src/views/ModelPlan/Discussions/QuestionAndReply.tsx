import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Label,
  Select,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  DiscussionUserRole,
  GetModelPlanDiscussionsQuery,
  useGetMostRecentRoleSelectionQuery
} from 'gql/gen/graphql';
import * as Yup from 'yup';

import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import MentionTextArea from 'components/shared/MentionTextArea';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';

import DiscussionUserInfo from './_components/DiscussionUserInfo';
import Replies from './Replies';
import { DiscussionFormPropTypes } from '.';

type DiscussionType = GetModelPlanDiscussionsQuery['modelPlan']['discussions'][0];
type ReplyType = GetModelPlanDiscussionsQuery['modelPlan']['discussions'][0]['replies'][0];

type QuestionAndReplyProps = {
  closeModal?: () => void;
  discussionReplyID?: string | null | undefined;
  handleCreateDiscussion: (formikValues: DiscussionFormPropTypes) => void;
  queryParams?: URLSearchParams;
  renderType: 'question' | 'reply';
  reply?: DiscussionType | ReplyType | null;
  setDiscussionReplyID?: (value: string | null | undefined) => void;
  setDiscussionType?: (value: 'question' | 'reply' | 'discussion') => void;
  setDiscussionStatusMessage: (value: string) => void;
  setInitQuestion?: (value: boolean) => void;
};

const QuestionAndReply = ({
  closeModal,
  discussionReplyID,
  handleCreateDiscussion,
  queryParams,
  renderType,
  reply,
  setDiscussionReplyID,
  setDiscussionType,
  setDiscussionStatusMessage,
  setInitQuestion
}: QuestionAndReplyProps) => {
  const { t: discussionsT } = useTranslation('discussions');
  const { t: discussionsMiscT } = useTranslation('discussionsMisc');
  const { t: h } = useTranslation('draftModelPlan');

  const { userRole: userRoleConfig } = usePlanTranslation('discussions');

  const history = useHistory();

  const validationSchema = Yup.object().shape({
    content: Yup.string().trim().required(`Please enter a ${renderType}`)
  });

  const { data, loading, error } = useGetMostRecentRoleSelectionQuery();

  const mostRecentUserRole = data?.mostRecentDiscussionRoleSelection?.userRole;
  const mostRecentUserRoleDescription =
    data?.mostRecentDiscussionRoleSelection?.userRoleDescription;

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
              <MentionTextArea
                id={`mention-${discussionReplyID}`}
                editable={false}
                initialContent={reply.content?.rawContent}
              />
            </div>
          </div>

          <Replies
            originalDiscussion={reply as DiscussionType}
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
          userRole: mostRecentUserRole || ('' as DiscussionUserRole),
          userRoleDescription: mostRecentUserRoleDescription || ''
        }}
        enableReinitialize
        onSubmit={handleCreateDiscussion}
        validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
      >
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
              <Form
                onSubmit={e => {
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
                        : discussionsMiscT('typeReply')}
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
                        setDiscussionStatusMessage('');
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
                          history.replace({
                            search: queryParams.toString()
                          });
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
                        !values.content ||
                        !values.userRole ||
                        (values.userRole ===
                          DiscussionUserRole.NONE_OF_THE_ABOVE &&
                          !values.userRoleDescription)
                      }
                      onClick={() => setErrors({})}
                    >
                      {renderType === 'question'
                        ? discussionsMiscT('save')
                        : discussionsMiscT('saveReply')}
                    </Button>
                  </div>
                </Fieldset>
              </Form>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default QuestionAndReply;
