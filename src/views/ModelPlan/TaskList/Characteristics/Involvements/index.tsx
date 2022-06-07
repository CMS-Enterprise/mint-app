import React, { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  IconAdd,
  IconArrowBack,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import GetModelPlanCharacteristics from 'queries/GetModelPlanCharacteristics';
import {
  GetModelPlanCharacteristics as GetModelPlanCharacteristicsType,
  GetModelPlanCharacteristics_modelPlan_generalCharacteristics as ModelPlanCharacteristicsFormType
} from 'queries/types/GetModelPlanCharacteristics';
import { UpdateModelPlanCharacteristicsVariables } from 'queries/types/UpdateModelPlanCharacteristics';
import UpdateModelPlanCharacteristics from 'queries/UpdateModelPlanCharacteristics';
import flattenErrors from 'utils/flattenErrors';

const Involvements = () => {
  const { t } = useTranslation('generalCharacteristics');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ModelPlanCharacteristicsFormType>>(null);
  const history = useHistory();
  const [
    isCareCoordinationInvolvedNote,
    setIsCareCoordinationInvolvedNote
  ] = useState(false);
  const [
    isAdditionalServicesInvolvedNote,
    setIsAdditionalServicesInvolvedNote
  ] = useState(false);
  const [
    isCommunityPartnersInvolvedNote,
    setIsCommunityPartnersInvolvedNote
  ] = useState(false);

  const { data } = useQuery<GetModelPlanCharacteristicsType>(
    GetModelPlanCharacteristics,
    {
      variables: {
        id: modelID
      }
    }
  );

  const modelName = data?.modelPlan?.modelName || '';

  const {
    id,
    careCoordinationInvolved,
    careCoordinationInvolvedDescription,
    careCoordinationInvolvedNote,
    additionalServicesInvolved,
    additionalServicesInvolvedDescription,
    additionalServicesInvolvedNote,
    communityPartnersInvolved,
    communityPartnersInvolvedDescription,
    communityPartnersInvolvedNote
  } =
    data?.modelPlan?.generalCharacteristics ||
    ({} as ModelPlanCharacteristicsFormType);

  const [update] = useMutation<UpdateModelPlanCharacteristicsVariables>(
    UpdateModelPlanCharacteristics
  );

  const handleFormSubmit = (
    formikValues: ModelPlanCharacteristicsFormType,
    redirect?: 'next' | 'back' | 'task-list'
  ) => {
    update({
      variables: {
        id,
        changes: formikValues
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(
              `/models/${modelID}/task-list/characteristics/targets-and-options`
            );
          } else if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/characteristics/key-characteristics`
            );
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues = {
    careCoordinationInvolved: careCoordinationInvolved ?? null,
    careCoordinationInvolvedDescription:
      careCoordinationInvolvedDescription ?? '',
    careCoordinationInvolvedNote: careCoordinationInvolvedNote ?? '',
    additionalServicesInvolved: additionalServicesInvolved ?? null,
    additionalServicesInvolvedDescription:
      additionalServicesInvolvedDescription ?? '',
    additionalServicesInvolvedNote: additionalServicesInvolvedNote ?? '',
    communityPartnersInvolved: communityPartnersInvolved ?? null,
    communityPartnersInvolvedDescription:
      communityPartnersInvolvedDescription ?? '',
    communityPartnersInvolvedNote: communityPartnersInvolvedNote ?? ''
  } as ModelPlanCharacteristicsFormType;

  return (
    <>
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{h('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{h('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-2">
        {t('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        <Trans i18nKey="modelPlanTaskList:subheading">
          indexZero {modelName} indexTwo
        </Trans>
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {h('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          handleFormSubmit(values, 'next');
        }}
        enableReinitialize
        // validationSchema={validationSchema}
        validateOnBlur={false}
        validateOnChange={false}
        validateOnMount={false}
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ModelPlanCharacteristicsFormType>) => {
          const {
            dirty,
            errors,
            handleSubmit,
            setErrors,
            setFieldValue,
            validateForm,
            isValid,
            values
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
                className="tablet:grid-col-6 margin-top-6"
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <FieldGroup
                  scrollElement="careCoordinationInvolved"
                  error={!!flatErrors.careCoordinationInvolved}
                  className="margin-y-4"
                >
                  <Label htmlFor="plan-characteristics-care-coordination-involved">
                    {t('careCoordination')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors.careCoordinationInvolved}
                  </FieldErrorMsg>
                  <Fieldset>
                    <Field
                      as={Radio}
                      id="plan-characteristics-care-coordination-involved"
                      name="careCoordinationInvolved"
                      label={h('yes')}
                      value="TRUE"
                      checked={values.careCoordinationInvolved === true}
                      onChange={() => {
                        setFieldValue('careCoordinationInvolved', true);
                        setFieldValue(
                          'careCoordinationInvolvedDescription',
                          ''
                        );
                      }}
                    />
                    {values.careCoordinationInvolved === true && (
                      <div className="display-flex margin-left-4 margin-bottom-1">
                        <FieldGroup
                          className="flex-1"
                          scrollElement="careCoordinationInvolvedDescription"
                          error={
                            !!flatErrors.careCoordinationInvolvedDescription
                          }
                        >
                          <Label
                            htmlFor="plan-characteristics-care-coordination-description"
                            className="margin-bottom-1"
                          >
                            {h('howSo')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors.careCoordinationInvolvedDescription}
                          </FieldErrorMsg>
                          <Field
                            as={TextAreaField}
                            error={
                              !!flatErrors.careCoordinationInvolvedDescription
                            }
                            className="margin-top-0 height-15"
                            id="plan-characteristics-care-coordination-description"
                            name="careCoordinationInvolvedDescription"
                          />
                        </FieldGroup>
                      </div>
                    )}
                    <Field
                      as={Radio}
                      id="plan-characteristics-care-coordination-involved-no"
                      name="careCoordinationInvolved"
                      label={h('no')}
                      value="FALSE"
                      checked={values.careCoordinationInvolved === false}
                      onChange={() => {
                        setFieldValue('careCoordinationInvolved', false);
                      }}
                    />
                  </Fieldset>
                </FieldGroup>

                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => setIsCareCoordinationInvolvedNote(true)}
                >
                  <IconAdd className="margin-right-1" aria-hidden />
                  {h('additionalNote')}
                </Button>

                {isCareCoordinationInvolvedNote && (
                  <FieldGroup>
                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="plan-characteristics-care-coordination-note"
                      name="careCoordinationInvolvedNote"
                      label={h('Notes')}
                    />
                  </FieldGroup>
                )}

                <FieldGroup
                  scrollElement="additionalServicesInvolved"
                  error={!!flatErrors.additionalServicesInvolved}
                  className="margin-y-4"
                >
                  <Label htmlFor="plan-characteristics-additional-services">
                    {t('additionalServices')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors.additionalServicesInvolved}
                  </FieldErrorMsg>
                  <Fieldset>
                    <Field
                      as={Radio}
                      id="plan-characteristics-additional-services"
                      name="additionalServicesInvolved"
                      label={h('yes')}
                      value="TRUE"
                      checked={values.additionalServicesInvolved === true}
                      onChange={() => {
                        setFieldValue('additionalServicesInvolved', true);
                        setFieldValue(
                          'additionalServicesInvolvedDescription',
                          ''
                        );
                      }}
                    />
                    {values.additionalServicesInvolved === true && (
                      <div className="display-flex margin-left-4 margin-bottom-1">
                        <FieldGroup
                          className="flex-1"
                          scrollElement="additionalServicesInvolvedDescription"
                          error={
                            !!flatErrors.additionalServicesInvolvedDescription
                          }
                        >
                          <Label
                            htmlFor="plan-characteristics-additional-services-description"
                            className="margin-bottom-1"
                          >
                            {h('howSo')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors.additionalServicesInvolvedDescription}
                          </FieldErrorMsg>
                          <Field
                            as={TextAreaField}
                            error={
                              !!flatErrors.additionalServicesInvolvedDescription
                            }
                            className="margin-top-0 height-15"
                            id="plan-characteristics-additional-services-description"
                            name="additionalServicesInvolvedDescription"
                          />
                        </FieldGroup>
                      </div>
                    )}
                    <Field
                      as={Radio}
                      id="plan-characteristics-additional-services-no"
                      name="additionalServicesInvolved"
                      label={h('no')}
                      value="FALSE"
                      checked={values.additionalServicesInvolved === false}
                      onChange={() => {
                        setFieldValue('additionalServicesInvolved', false);
                      }}
                    />
                  </Fieldset>
                </FieldGroup>

                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => setIsAdditionalServicesInvolvedNote(true)}
                >
                  <IconAdd className="margin-right-1" aria-hidden />
                  {h('additionalNote')}
                </Button>

                {isAdditionalServicesInvolvedNote && (
                  <FieldGroup>
                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="plan-characteristics-additional-services-note"
                      name="additionalServicesInvolvedNote"
                      label={h('Notes')}
                    />
                  </FieldGroup>
                )}

                <FieldGroup
                  scrollElement="communityPartnersInvolved"
                  error={!!flatErrors.communityPartnersInvolved}
                  className="margin-y-4"
                >
                  <Label htmlFor="plan-characteristics-community-partners-involved">
                    {t('communityInvolved')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors.communityPartnersInvolved}
                  </FieldErrorMsg>
                  <Fieldset>
                    <Field
                      as={Radio}
                      id="plan-characteristics-community-partners-involved"
                      name="communityPartnersInvolved"
                      label={h('yes')}
                      value="TRUE"
                      checked={values.communityPartnersInvolved === true}
                      onChange={() => {
                        setFieldValue('communityPartnersInvolved', true);
                        setFieldValue(
                          'communityPartnersInvolvedDescription',
                          ''
                        );
                      }}
                    />
                    {values.communityPartnersInvolved === true && (
                      <div className="display-flex margin-left-4 margin-bottom-1">
                        <FieldGroup
                          className="flex-1"
                          scrollElement="communityPartnersInvolvedDescription"
                          error={
                            !!flatErrors.communityPartnersInvolvedDescription
                          }
                        >
                          <Label
                            htmlFor="plan-characteristics-community-partners-description"
                            className="margin-bottom-1"
                          >
                            {h('howSo')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors.communityPartnersInvolvedDescription}
                          </FieldErrorMsg>
                          <Field
                            as={TextAreaField}
                            error={
                              !!flatErrors.communityPartnersInvolvedDescription
                            }
                            className="margin-top-0 height-15"
                            id="plan-characteristics-community-partners-description"
                            name="communityPartnersInvolvedDescription"
                          />
                        </FieldGroup>
                      </div>
                    )}
                    <Field
                      as={Radio}
                      id="plan-characteristics-community-partners-no"
                      name="communityPartnersInvolved"
                      label={h('no')}
                      value="FALSE"
                      checked={values.communityPartnersInvolved === false}
                      onChange={() => {
                        setFieldValue('communityPartnersInvolved', false);
                      }}
                    />
                  </Fieldset>
                </FieldGroup>

                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => setIsCommunityPartnersInvolvedNote(true)}
                >
                  <IconAdd className="margin-right-1" aria-hidden />
                  {h('additionalNote')}
                </Button>

                {isCommunityPartnersInvolvedNote && (
                  <FieldGroup>
                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="plan-characteristics-community-partners-note"
                      name="communityPartnersInvolvedNote"
                      label={h('Notes')}
                    />
                  </FieldGroup>
                )}

                <div className="margin-top-6 margin-bottom-3">
                  <Button
                    type="button"
                    className="usa-button usa-button--outline margin-bottom-1"
                    onClick={() => {
                      if (Object.keys(errors).length > 0) {
                        window.scrollTo(0, 0);
                      } else {
                        validateForm().then(err => {
                          if (Object.keys(err).length > 0) {
                            window.scrollTo(0, 0);
                          } else {
                            handleFormSubmit(values, 'back');
                          }
                        });
                      }
                    }}
                  >
                    {h('back')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={!(dirty || isValid)}
                    onClick={() => setErrors({})}
                  >
                    {h('next')}
                  </Button>
                </div>
                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => handleFormSubmit(values, 'task-list')}
                >
                  <IconArrowBack className="margin-right-1" aria-hidden />
                  {h('saveAndReturn')}
                </Button>
              </Form>
              {id && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit(formikRef.current!.values);
                  }}
                  debounceDelay={3000}
                />
              )}
            </>
          );
        }}
      </Formik>
      <PageNumber currentPage={3} totalPages={5} className="margin-y-6" />
    </>
  );
};

export default Involvements;
