import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Label, Textarea } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import * as Yup from 'yup';

import PageHeading from 'components/PageHeading';
import AssessmentIcon from 'components/shared/AssessmentIcon';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import IconInitial from 'components/shared/IconInitial';
import {
  GetModelPlanDiscussions_modelPlan_discussions as DiscussionType,
  GetModelPlanDiscussions_modelPlan_discussions_replies as ReplyType
} from 'queries/Discussions/types/GetModelPlanDiscussions';
import { getTimeElapsed } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';

type QuestionAndReplyProps = {
  closeModal?: () => void;
  discussionReplyID?: string | null | undefined;
  handleCreateDiscussion: (formikValues: { content: string }) => void;
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
        {(formikProps: FormikProps<{ content: string }>) => {
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

export default QuestionAndReply;
