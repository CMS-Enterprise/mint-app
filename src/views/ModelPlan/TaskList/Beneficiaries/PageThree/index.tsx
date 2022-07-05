import React, { Fragment, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Grid,
  GridContainer,
  IconArrowBack,
  Label,
  Radio,
  RangeInput,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import TextField from 'components/shared/TextField';
import GetModelPlanBeneficiaries from 'queries/GetModelPlanBeneficiaries';
import {
  GetModelPlanBeneficiaries as GetModelPlanBeneficiariesType,
  GetModelPlanBeneficiaries_modelPlan_beneficiaries as ModelPlanBeneficiariesFormType
} from 'queries/types/GetModelPlanBeneficiaries';
import { UpdateModelPlanBeneficiariesVariables } from 'queries/types/UpdateModelPlanBeneficiaries';
import UpdateModelPlanBeneficiaries from 'queries/UpdateModelPlanBeneficiaries';
import { FrequencyType, OverlapType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateFrequencyType,
  translateOverlapType
} from 'utils/modelPlan';

const BeneficiariesPageThree = () => {
  const { t } = useTranslation('beneficiaries');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<ModelPlanBeneficiariesFormType>>(null);
  const history = useHistory();

  const { data } = useQuery<GetModelPlanBeneficiariesType>(
    GetModelPlanBeneficiaries,
    {
      variables: {
        id: modelID
      }
    }
  );

  const {
    id,
    beneficiarySelectionFrequency,
    beneficiarySelectionFrequencyNote,
    beneficiarySelectionFrequencyOther,
    beneficiaryOverlap,
    beneficiaryOverlapNote,
    precedenceRules
  } = data?.modelPlan?.beneficiaries || ({} as ModelPlanBeneficiariesFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdateModelPlanBeneficiariesVariables>(
    UpdateModelPlanBeneficiaries
  );

  const handleFormSubmit = (
    formikValues: ModelPlanBeneficiariesFormType,
    redirect?: 'next' | 'back'
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
              `/models/${modelID}/task-list/beneficiaries/page-three`
            );
          } else if (redirect === 'back') {
            history.push(`/models/${modelID}/task-list/`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues = {
    beneficiarySelectionFrequency: beneficiarySelectionFrequency ?? null,
    beneficiarySelectionFrequencyNote: beneficiarySelectionFrequencyNote ?? '',
    beneficiarySelectionFrequencyOther:
      beneficiarySelectionFrequencyOther ?? '',
    beneficiaryOverlap: beneficiaryOverlap ?? null,
    beneficiaryOverlapNote: beneficiaryOverlapNote ?? '',
    precedenceRules: precedenceRules ?? ''
  } as ModelPlanBeneficiariesFormType;

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
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<ModelPlanBeneficiariesFormType>) => {
          const {
            errors,
            handleSubmit,
            setErrors,
            setFieldValue,
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
              <GridContainer className="padding-left-0 padding-right-0">
                <Grid row gap className="beneficiaries__info">
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
                      data-testid="beneficiaries-participants-form"
                      onSubmit={e => {
                        handleSubmit(e);
                      }}
                    >
                      <FieldGroup
                        scrollElement="beneficiarySelectionFrequency"
                        error={!!flatErrors.beneficiarySelectionFrequency}
                      >
                        <Label htmlFor="beneficiaries-beneficiarySelectionFrequency">
                          {t('beneficiaryFrequency')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.beneficiarySelectionFrequency}
                        </FieldErrorMsg>
                        <Fieldset>
                          {Object.keys(FrequencyType)
                            .sort(sortOtherEnum)
                            .map(key => (
                              <Fragment key={key}>
                                <Field
                                  as={Radio}
                                  id={`beneficiaries-beneficiarySelectionFrequency-${key}`}
                                  name="beneficiaries-beneficiarySelectionFrequency"
                                  label={translateFrequencyType(key)}
                                  value={key}
                                  checked={
                                    values.beneficiarySelectionFrequency === key
                                  }
                                  onChange={() => {
                                    setFieldValue(
                                      'beneficiarySelectionFrequency',
                                      key
                                    );
                                  }}
                                />
                                {key === 'OTHER' &&
                                  values.beneficiarySelectionFrequency ===
                                    key && (
                                    <div className="margin-left-4 margin-top-1">
                                      <Label
                                        htmlFor="beneficiaries-beneficiarySelectionFrequency-other"
                                        className="text-normal"
                                      >
                                        {h('pleaseSpecify')}
                                      </Label>
                                      <FieldErrorMsg>
                                        {
                                          flatErrors.beneficiarySelectionFrequencyOther
                                        }
                                      </FieldErrorMsg>
                                      <Field
                                        as={TextInput}
                                        className="maxw-none"
                                        id="beneficiaries-beneficiarySelectionFrequency-other"
                                        maxLength={50}
                                        name="beneficiarySelectionFrequencyOther"
                                      />
                                    </div>
                                  )}
                              </Fragment>
                            ))}
                        </Fieldset>
                        <AddNote
                          id="beneficiaries-beneficiarySelectionFrequency-note"
                          field="beneficiarySelectionFrequencyNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="beneficiaryOverlap"
                        error={!!flatErrors.beneficiaryOverlap}
                      >
                        <Label htmlFor="beneficiaries-overlap">
                          {t('levelOfConfidence')}
                        </Label>
                        <FieldErrorMsg>
                          {flatErrors.beneficiaryOverlap}
                        </FieldErrorMsg>
                        <Fieldset>
                          {Object.keys(OverlapType)
                            .sort(sortOtherEnum)
                            .map(key => (
                              <Fragment key={key}>
                                <Field
                                  as={Radio}
                                  id={`beneficiaries-overlap-${key}`}
                                  name="beneficiaries-overlap"
                                  label={translateOverlapType(key)}
                                  value={key}
                                  checked={values.beneficiaryOverlap === key}
                                  onChange={() => {
                                    setFieldValue('beneficiaryOverlap', key);
                                  }}
                                />
                              </Fragment>
                            ))}
                        </Fieldset>
                        <AddNote
                          id="beneficiaries-overlap-note"
                          field="beneficiaryOverlapNote"
                        />
                      </FieldGroup>

                      <FieldGroup
                        scrollElement="precedenceRules"
                        error={!!flatErrors.precedenceRules}
                      >
                        <Label
                          htmlFor="beneficiaries-precedenceRules"
                          className="maxw-none"
                        >
                          {t('benficiaryPrecedence')}
                        </Label>
                        <p className="text-base margin-0 line-height-body-3">
                          {t('benficiaryPrecedenceExtra')}
                        </p>
                        <FieldErrorMsg>
                          {flatErrors.precedenceRules}
                        </FieldErrorMsg>
                        <Field
                          as={TextAreaField}
                          className="height-15"
                          error={flatErrors.precedenceRules}
                          id="beneficiaries-precedenceRules"
                          data-testid="beneficiaries-precedenceRules"
                          name="precedenceRules"
                        />
                      </FieldGroup>

                      <div className="margin-top-6 margin-bottom-3">
                        <Button
                          type="button"
                          className="usa-button usa-button--outline margin-bottom-1"
                          onClick={() => {
                            handleFormSubmit(values, 'back');
                          }}
                        >
                          {h('back')}
                        </Button>
                        <Button type="submit" onClick={() => setErrors({})}>
                          {h('saveAndStartNext')}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        className="usa-button usa-button--unstyled"
                        onClick={() => handleFormSubmit(values, 'back')}
                      >
                        <IconArrowBack className="margin-right-1" aria-hidden />
                        {h('saveAndReturn')}
                      </Button>
                    </Form>
                  </Grid>
                </Grid>
              </GridContainer>
              {/* TODO: Comment to stop obnoxious errors */}
              {/* {id && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit(formikRef.current!.values);
                  }}
                  debounceDelay={3000}
                />
              )} */}
            </>
          );
        }}
      </Formik>
      <PageNumber currentPage={3} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default BeneficiariesPageThree;
