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
import getFrequency from 'queries/Beneficiaries/getFrequency';
import {
  GetFrequency as BeneficiaryFrequencyType,
  GetFrequency_modelPlan_beneficiaries as FrequencyFormType
} from 'queries/Beneficiaries/types/GetFrequency';
import { UpdateModelPlanBeneficiariesVariables } from 'queries/Beneficiaries/types/UpdateModelPlanBeneficiaries';
import UpdateModelPlanBeneficiaries from 'queries/Beneficiaries/UpdateModelPlanBeneficiaries';
import { FrequencyType, OverlapType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import {
  sortOtherEnum,
  translateFrequencyType,
  translateOverlapType
} from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

const Frequency = () => {
  const { t } = useTranslation('beneficiaries');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<FrequencyFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<BeneficiaryFrequencyType>(
    getFrequency,
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
  } = data?.modelPlan?.beneficiaries || ({} as FrequencyFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdateModelPlanBeneficiariesVariables>(
    UpdateModelPlanBeneficiaries
  );

  const handleFormSubmit = (
    formikValues: FrequencyFormType,
    redirect?: 'task-list' | 'back'
  ) => {
    const { id: updateId, __typename, ...changeValues } = formikValues;
    update({
      variables: {
        id: updateId,
        changes: changeValues
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/beneficiaries/people-impact`
            );
          } else if (redirect === 'task-list') {
            history.push(`/models/${modelID}/task-list/`);
          }
        }
      })
      .catch(errors => {
        formikRef?.current?.setErrors(errors);
      });
  };

  const initialValues: FrequencyFormType = {
    __typename: 'PlanBeneficiaries',
    id: id ?? '',
    beneficiarySelectionFrequency: beneficiarySelectionFrequency ?? null,
    beneficiarySelectionFrequencyNote: beneficiarySelectionFrequencyNote ?? '',
    beneficiarySelectionFrequencyOther:
      beneficiarySelectionFrequencyOther ?? '',
    beneficiaryOverlap: beneficiaryOverlap ?? null,
    beneficiaryOverlapNote: beneficiaryOverlapNote ?? '',
    precedenceRules: precedenceRules ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

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
          handleFormSubmit(values, 'task-list');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<FrequencyFormType>) => {
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
                <Grid row gap>
                  <Grid desktop={{ col: 6 }}>
                    <Form
                      className="margin-top-6"
                      data-testid="beneficiaries-frequency-form"
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
                          htmlFor="beneficiaries-precedence-rules"
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
                          id="beneficiaries-precedence-rules"
                          data-testid="beneficiaries-precedence-rules"
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
                        onClick={() => handleFormSubmit(values, 'task-list')}
                      >
                        <IconArrowBack className="margin-right-1" aria-hidden />
                        {h('saveAndReturn')}
                      </Button>
                    </Form>
                  </Grid>
                </Grid>
              </GridContainer>
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
      <PageNumber currentPage={3} totalPages={3} className="margin-y-6" />
    </>
  );
};

export default Frequency;
