import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  IconArrowBack,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import GetIDDOCTesting from 'queries/OpsEvalAndLearning/GetIDDOCTesting';
import {
  GetIDDOCTesting as GetIDDOCTestingType,
  GetIDDOCTesting_modelPlan_opsEvalAndLearning as IDDOCTestingFormType,
  GetIDDOCTestingVariables
} from 'queries/OpsEvalAndLearning/types/GetIDDOCTesting';
import { UpdatePlanOpsEvalAndLearningVariables } from 'queries/OpsEvalAndLearning/types/UpdatePlanOpsEvalAndLearning';
import UpdatePlanOpsEvalAndLearning from 'queries/OpsEvalAndLearning/UpdatePlanOpsEvalAndLearning';
import { MonitoringFileType } from 'types/graphql-global-types';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { sortOtherEnum, translateMonitoringFileType } from 'utils/modelPlan';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

const IDDOCTesting = () => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<IDDOCTestingFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useQuery<
    GetIDDOCTestingType,
    GetIDDOCTestingVariables
  >(GetIDDOCTesting, {
    variables: {
      id: modelID
    }
  });

  const {
    id,
    iddocSupport,
    ccmInvolvment,
    dataNeededForMonitoring,
    uatNeeds,
    stcNeeds,
    testingTimelines,
    testingNote,
    dataMonitoringFileTypes,
    dataMonitoringFileOther,
    dataResponseType,
    dataResponseFileFrequency
  } = data?.modelPlan?.opsEvalAndLearning || ({} as IDDOCTestingFormType);

  const modelName = data?.modelPlan?.modelName || '';

  const [update] = useMutation<UpdatePlanOpsEvalAndLearningVariables>(
    UpdatePlanOpsEvalAndLearning
  );

  const handleFormSubmit = (redirect?: 'next' | 'back' | 'task-list') => {
    update({
      variables: {
        id,
        changes: dirtyInput(
          formikRef?.current?.initialValues,
          formikRef?.current?.values
        )
      }
    })
      .then(response => {
        if (!response?.errors) {
          if (redirect === 'next') {
            history.push(
              `/models/${modelID}/task-list/ops-eval-and-learning/iddoc-monitoring`
            );
          } else if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/ops-eval-and-learning/iddoc`
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

  const initialValues: IDDOCTestingFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    iddocSupport: iddocSupport ?? null,
    uatNeeds: uatNeeds ?? '',
    stcNeeds: stcNeeds ?? '',
    testingTimelines: testingTimelines ?? '',
    testingNote: testingNote ?? '',
    dataMonitoringFileTypes: dataMonitoringFileTypes ?? [],
    dataMonitoringFileOther: dataMonitoringFileOther ?? '',
    dataResponseType: dataResponseType ?? '',
    dataResponseFileFrequency: dataResponseFileFrequency ?? ''
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
        {h('for')} {modelName}
      </p>
      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {h('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          handleFormSubmit('next');
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<IDDOCTestingFormType>) => {
          const { errors, handleSubmit, setErrors, values } = formikProps;
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
                data-testid="ops-eval-and-learning-iddoc-testing-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <h3>{t('testingQuestions')}</h3>

                <Alert
                  type="info"
                  slim
                  data-testid="mandatory-fields-alert"
                  className="margin-bottom-4"
                >
                  <span className="mandatory-fields-alert__text">
                    {t('ssmRequest')}
                  </span>
                </Alert>

                <FieldGroup
                  scrollElement="uatNeeds"
                  className="margin-top-6"
                  error={!!flatErrors.uatNeeds}
                >
                  <Label htmlFor="ops-eval-and-learning-uat-needs">
                    {t('uatNeeds')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.uatNeeds}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    className="height-15"
                    error={flatErrors.uatNeeds}
                    id="ops-eval-and-learning-uat-needs"
                    name="uatNeeds"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="stcNeeds"
                  className="margin-top-6"
                  error={!!flatErrors.stcNeeds}
                >
                  <Label htmlFor="ops-eval-and-learning-stc-needs">
                    {t('stcNeeds')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.stcNeeds}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    className="height-15"
                    error={flatErrors.stcNeeds}
                    id="ops-eval-and-learning-stc-needs"
                    data-testid="ops-eval-and-learning-stc-needs"
                    name="stcNeeds"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="testingTimelines"
                  className="margin-top-6"
                  error={!!flatErrors.testingTimelines}
                >
                  <Label htmlFor="ops-eval-and-learning-testing-timelines">
                    {t('testingTimelines')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.testingTimelines}</FieldErrorMsg>
                  <Field
                    as={TextAreaField}
                    className="height-15"
                    error={flatErrors.testingTimelines}
                    id="ops-eval-and-learning-testing-timelines"
                    name="testingTimelines"
                  />
                </FieldGroup>

                <AddNote
                  id="ops-eval-and-learning-testing-note"
                  field="testingNote"
                />

                <h3>{t('dataMonitoring')}</h3>

                <FieldArray
                  name="dataMonitoringFileTypes"
                  render={arrayHelpers => (
                    <>
                      <legend className="usa-label maxw-none">
                        {t('fileTypes')}
                      </legend>
                      <FieldErrorMsg>
                        {flatErrors.dataMonitoringFileTypes}
                      </FieldErrorMsg>

                      {Object.keys(MonitoringFileType)
                        .sort(sortOtherEnum)
                        .map(type => {
                          return (
                            <Fragment key={type}>
                              <Field
                                as={CheckboxField}
                                id={`ops-eval-and-learning-data-monitoring-file-${type}`}
                                name="dataMonitoringFileTypes"
                                label={translateMonitoringFileType(type)}
                                value={type}
                                checked={values?.dataMonitoringFileTypes.includes(
                                  type as MonitoringFileType
                                )}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (e.target.checked) {
                                    arrayHelpers.push(e.target.value);
                                  } else {
                                    const idx = values.dataMonitoringFileTypes.indexOf(
                                      e.target.value as MonitoringFileType
                                    );
                                    arrayHelpers.remove(idx);
                                  }
                                }}
                              />
                              {type === 'OTHER' &&
                                values.dataMonitoringFileTypes.includes(
                                  MonitoringFileType.OTHER
                                ) && (
                                  <div className="margin-left-4 margin-top-neg-3">
                                    <Label
                                      htmlFor="ops-eval-and-learning-data-monitoring-file-other"
                                      className="text-normal"
                                    >
                                      {h('pleaseSpecify')}
                                    </Label>
                                    <FieldErrorMsg>
                                      {flatErrors.dataMonitoringFileOther}
                                    </FieldErrorMsg>
                                    <Field
                                      as={TextInput}
                                      className="maxw-none"
                                      id="ops-eval-and-learning-data-monitoring-file-other"
                                      maxLength={50}
                                      name="dataMonitoringFileOther"
                                    />
                                  </div>
                                )}
                            </Fragment>
                          );
                        })}
                    </>
                  )}
                />

                <FieldGroup
                  scrollElement="dataResponseType"
                  className="margin-top-6"
                  error={!!flatErrors.dataResponseType}
                >
                  <Label htmlFor="ops-eval-and-learning-data-response-type">
                    {t('responseTypes')}
                  </Label>
                  <FieldErrorMsg>{flatErrors.dataResponseType}</FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!flatErrors.dataResponseType}
                    id="ops-eval-and-learning-data-response-type"
                    maxLength={50}
                    name="dataResponseType"
                  />
                </FieldGroup>

                <FieldGroup
                  scrollElement="dataResponseFileFrequency"
                  className="margin-top-6"
                  error={!!flatErrors.dataResponseFileFrequency}
                >
                  <Label htmlFor="ops-eval-and-learning-data-file-frequency">
                    {t('fileFrequency')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors.dataResponseFileFrequency}
                  </FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!flatErrors.dataResponseFileFrequency}
                    id="ops-eval-and-learning-data-file-frequency"
                    maxLength={50}
                    name="dataResponseFileFrequency"
                  />
                </FieldGroup>

                <div className="margin-top-6 margin-bottom-3">
                  <Button
                    type="button"
                    className="usa-button usa-button--outline margin-bottom-1"
                    onClick={() => {
                      handleFormSubmit('back');
                    }}
                  >
                    {h('back')}
                  </Button>
                  <Button type="submit" onClick={() => setErrors({})}>
                    {h('next')}
                  </Button>
                </div>
                <Button
                  type="button"
                  className="usa-button usa-button--unstyled"
                  onClick={() => handleFormSubmit('task-list')}
                >
                  <IconArrowBack className="margin-right-1" aria-hidden />
                  {h('saveAndReturn')}
                </Button>
              </Form>

              {id && (
                <AutoSave
                  values={values}
                  onSave={() => {
                    handleFormSubmit();
                  }}
                  debounceDelay={3000}
                />
              )}
            </>
          );
        }}
      </Formik>
      {data && (
        <PageNumber
          currentPage={renderCurrentPage(
            3,
            iddocSupport,
            isCCWInvolvement(ccmInvolvment) ||
              isQualityMeasures(dataNeededForMonitoring)
          )}
          totalPages={renderTotalPages(
            iddocSupport,
            isCCWInvolvement(ccmInvolvment) ||
              isQualityMeasures(dataNeededForMonitoring)
          )}
          className="margin-y-6"
        />
      )}
    </>
  );
};

export default IDDOCTesting;
