import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import {
  Button,
  Grid,
  GridContainer,
  IconAnnouncement,
  IconClose,
  Textarea
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import noScroll from 'no-scroll';

import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import { GetModelPlan_modelPlan_discussions as DiscussionType } from 'queries/types/GetModelPlan';
import flattenErrors from 'utils/flattenErrors';

import './index.scss';

type DiscussionsProps = {
  //   children: ReactNode | ReactNodeArray;
  isOpen: boolean;
  discussions: DiscussionType[];
  openModal?: () => void;
  closeModal: () => void;
};

const Discussions = ({
  //   children,
  isOpen,
  discussions,
  openModal,
  closeModal
}: DiscussionsProps) => {
  const { t } = useTranslation('discussions');

  const handleOpenModal = () => {
    noScroll.on();
    if (openModal) {
      openModal();
    }
  };

  const renderQuestion = () => {
    return (
      <>
        {' '}
        <PageHeading headingLevel="h1" className="margin-top-0">
          {t('askAQuestion')}
        </PageHeading>
        <Formik
          initialValues={{ content: '' }}
          onSubmit={handleCreateDraftModelPlan}
          validationSchema={NewModelPlanValidationSchema}
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
                    heading="Please check and fix the following"
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
                    scrollElement="modelName"
                    error={!!flatErrors.modelName}
                  >
                    <Label htmlFor="new-plan-model-name">{t('modeName')}</Label>
                    <FieldErrorMsg>{flatErrors.modelName}</FieldErrorMsg>
                    <Field
                      as={Textarea}
                      error={!!flatErrors.modelName}
                      id="new-plan-model-name"
                      maxLength={50}
                      name="modelName"
                    />
                  </FieldGroup>
                  <div className="margin-top-5 display-block">
                    <UswdsReactLink
                      className="usa-button usa-button--outline margin-bottom-1"
                      variant="unstyled"
                      to="/models/steps-overview"
                    >
                      {h('cancel')}
                    </UswdsReactLink>
                    <Button
                      type="submit"
                      disabled={!dirty}
                      onClick={() => setErrors({})}
                    >
                      {h('next')}
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

  const renderDiscussions = () => {
    return (
      <>
        {' '}
        <PageHeading headingLevel="h1" className="margin-top-0">
          {t('heading')}
        </PageHeading>
        <div className="display-flex">
          <IconAnnouncement className="text-primary margin-right-1" />
          <Button type="button" unstyled onClick={() => console.log('hey')}>
            {t('askAQuestionLink')}
          </Button>
        </div>
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
          {discussions?.length > 0 ? renderDiscussions() : renderQuestion()}
        </Grid>
      </GridContainer>
    </ReactModal>
  );
};

export default Discussions;
