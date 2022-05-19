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
import { Field, Form, Formik, FormikProps } from 'formik';
import _ from 'lodash';
import noScroll from 'no-scroll';
import * as Yup from 'yup';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import CreateModelPlanDiscussion from 'queries/CreateModelPlanDiscussion';
import { CreateModelPlanDiscussion as CreateModelPlanDiscussionType } from 'queries/types/CreateModelPlanDiscussion';
import { GetModelPlan_modelPlan_discussions as DiscussionType } from 'queries/types/GetModelPlan';
import flattenErrors from 'utils/flattenErrors';
import { getUnansweredQuestions } from 'utils/modelPlan';

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
  const [isRenderQuestion, setIsRenderQuestion] = useState(false);

  useEffect(() => {
    if (discussions?.length === 0) {
      setIsRenderQuestion(true);
    }
    setQuestionCount(getUnansweredQuestions(discussions));
  }, [discussions]);

  const [create] = useMutation<CreateModelPlanDiscussionType>(
    CreateModelPlanDiscussion
  );

  const validationSchema = Yup.object().shape({
    content: Yup.string().trim().required('Please enter a question')
  });

  const handleOpenModal = () => {
    noScroll.on();
    if (openModal) {
      openModal();
    }
  };

  const handleCreateDiscussion = (formikValues: DicussionFormPropTypes) => {
    create({
      variables: {
        input: {
          modelPlanID: modelID,
          content: formikValues.content
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          setDiscussionStatus('success');
          setDiscussionStatusMessage(t('success'));
          setIsRenderQuestion(false);
          refetch();
        }
      })
      .catch(() => {
        setDiscussionStatus('error');
        setDiscussionStatusMessage(t('error'));
      });
  };

  const renderQuestion = () => {
    return (
      <>
        {' '}
        <PageHeading headingLevel="h1" className="margin-y-0">
          {t('askAQuestion')}
        </PageHeading>
        <p className="margin-bottom-4">{t('description')}</p>
        {discussionStatusMessage && (
          <Alert type={discussionStatus}>{discussionStatusMessage}</Alert>
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
                      {t('typeQuestion')}
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
                        if (isRenderQuestion) {
                          setIsRenderQuestion(false);
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
                      {t('save')}
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

  const discussionAccordion = ['UNANSWERED', 'ANSWERED'].map(status => (
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
          content: <></>,
          expanded: false,
          id: status,
          headingLevel: 'h4'
        }
      ]}
    />
  ));

  const formatDiscussions = (discussions: DiscussionType[]) => {};

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
            onClick={() => setIsRenderQuestion(true)}
          >
            {t('askAQuestionLink')}
          </Button>
        </div>
        {discussionStatusMessage && (
          <Alert type={discussionStatus} className="margin-bottom-4">
            {discussionStatusMessage}
          </Alert>
        )}
        {discussionAccordion}
      </>
    );
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="mint-discussions__overlay"
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
        <Grid desktop={{ col: 12 }}>
          {isRenderQuestion ? renderQuestion() : renderDiscussions()}
        </Grid>
      </GridContainer>
    </ReactModal>
  );
};

export default Discussions;
