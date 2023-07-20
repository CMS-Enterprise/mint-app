import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Button,
  Dropdown,
  Fieldset,
  Label,
  Textarea,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import PageHeading from 'components/PageHeading';
import AssessmentIcon from 'components/shared/AssessmentIcon';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import IconInitial from 'components/shared/IconInitial';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import GetMostRecentRoleSelection from 'queries/Discussions/GetMostRecentRoleSelection';
import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'queries/Discussions/types/GetModelPlanDiscussions';
import { GetMostRecentRoleSelection as GetMostRecentRoleSelectionType } from 'queries/Discussions/types/GetMostRecentRoleSelection';
import { DiscussionUserRole } from 'types/graphql-global-types';
import { getTimeElapsed } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import { sortOtherEnum } from 'utils/modelPlan';

import { DicussionFormPropTypes } from '.';

type QuestionAndReplyProps = {
  closeModal?: () => void;
  discussionReplyID?: string | null | undefined;
  handleCreateDiscussion: (formikValues: DicussionFormPropTypes) => void;
  queryParams?: URLSearchParams;
  renderType: 'question' | 'reply';
  reply?: DiscussionType | ReplyType | null;
  setDiscussionReplyID?: (value: string | null | undefined) => void;
  setDiscussionStatusMessage?: (value: string) => void;
  setDiscussionType?: (value: 'question' | 'reply' | 'discussion') => void;
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
  setDiscussionStatusMessage,
  setDiscussionType,
  setInitQuestion
}: QuestionAndReplyProps) => {
  const { t } = useTranslation('discussions');
  const { t: h } = useTranslation('draftModelPlan');

  const history = useHistory();

  const validationSchema = Yup.object().shape({
    content: Yup.string().trim().required(`Please enter a ${renderType}`)
  });

  const { data, loading } = useQuery<GetMostRecentRoleSelectionType>(
    GetMostRecentRoleSelection
  );

  const mostRecentUserRole = data?.mostRecentDiscussionRoleSelection?.userRole;
  const mostRecentUserRoleDescription =
    data?.mostRecentDiscussionRoleSelection?.userRoleDescription;

  return (
    <>
      <PageHeading headingLevel="h1" className="margin-y-0">
        {renderType === 'question' ? t('askAQuestion') : t('answer')}
      </PageHeading>

      <p className="margin-bottom-4">
        {renderType === 'question' ? t('description') : t('answerDescription')}
      </p>

      {/* If renderType is reply, render the related question that is being answered */}
      {renderType === 'reply' && reply && (
        <div>
          <div className="display-flex flex-wrap flex-justify">
            {reply.isAssessment ? (
              <div className="display-flex flex-align-center">
                <AssessmentIcon size={3} />{' '}
                <span>
                  {t('assessment')} | {reply.createdByUserAccount.commonName}
                </span>
              </div>
            ) : (
              <IconInitial
                className="margin-bottom-1"
                user={reply.createdByUserAccount.commonName}
                index={0}
              />
            )}
            <span className="margin-left-5 margin-top-05 text-base">
              {getTimeElapsed(reply.createdDts)
                ? getTimeElapsed(reply.createdDts) + t('ago')
                : t('justNow')}
            </span>
          </div>

          {reply.userRole && (
            <p className="text-base margin-left-5 margin-y-0">
              {reply.userRole === DiscussionUserRole.NONE_OF_THE_ABOVE
                ? reply.userRoleDescription
                : t(`userRole.${reply.userRole}`)}
            </p>
          )}

          <div className="margin-left-5">
            <p>{reply.content}</p>
          </div>
        </div>
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
        {(formikProps: FormikProps<DicussionFormPropTypes>) => {
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
                <Fieldset disabled={loading}>
                  <FieldGroup
                    scrollElement="user-role"
                    error={!!flatErrors.userRole}
                    className="margin-top-4"
                  >
                    <Label htmlFor="user-role">
                      {t('role')}
                      <RequiredAsterisk />
                    </Label>

                    <p className="text-base margin-top-0">{t('roleInfo')}</p>

                    <FieldErrorMsg>{flatErrors.userRole}</FieldErrorMsg>

                    <Field
                      as={Dropdown}
                      id="user-role"
                      name="userRole"
                      disabled={loading}
                      value={values.userRole || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('userRole', e.target.value);
                      }}
                    >
                      <option key="default-select" disabled value="">
                        {`-${t('select')}-`}
                      </option>
                      {Object.keys(DiscussionUserRole)
                        .sort(sortOtherEnum)
                        .map(role => {
                          return (
                            <option key={role} value={role}>
                              {t(`userRole.${role}`)}
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
                          {t('enterDescription')}
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
                        if (
                          renderType &&
                          setDiscussionStatusMessage &&
                          setDiscussionType
                        ) {
                          setDiscussionStatusMessage('');
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
                      {renderType === 'question' ? t('save') : t('saveAnswer')}
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
