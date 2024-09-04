import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Icon,
  Label,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetIddocTestingQuery,
  MonitoringFileType,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetIddocTestingQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import Alert from 'components/shared/Alert';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import TextAreaField from 'components/shared/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

type IDDOCTestingFormType = GetIddocTestingQuery['modelPlan']['opsEvalAndLearning'];

const IDDOCTesting = () => {
  const { t: opsEvalAndLearningT } = useTranslation('opsEvalAndLearning');

  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    dataMonitoringFileTypes: dataMonitoringFileTypesConfig
  } = usePlanTranslation('opsEvalAndLearning');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<IDDOCTestingFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetIddocTestingQuery({
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
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as IDDOCTestingFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef
    }
  );

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
      <MutationErrorModal
        isOpen={mutationError.isModalOpen}
        closeModal={() => mutationError.setIsModalOpen(false)}
        url={mutationError.destinationURL}
      />

      <Breadcrumbs
        items={[
          BreadcrumbItemOptions.HOME,
          BreadcrumbItemOptions.COLLABORATION_AREA,
          BreadcrumbItemOptions.TASK_LIST,
          BreadcrumbItemOptions.OPS_EVAL_AND_LEARNING
        ]}
      />

      <PageHeading className="margin-top-4 margin-bottom-2">
        {opsEvalAndLearningMiscT('heading')}
      </PageHeading>

      <p
        className="margin-top-0 margin-bottom-1 font-body-lg"
        data-testid="model-plan-name"
      >
        {miscellaneousT('for')} {modelName}
      </p>

      <p className="margin-bottom-2 font-body-md line-height-sans-4">
        {miscellaneousT('helpText')}
      </p>

      <AskAQuestion modelID={modelID} />

      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          history.push(
            `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/iddoc-monitoring`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<IDDOCTestingFormType>) => {
          const { errors, handleSubmit, setErrors, values } = formikProps;

          const flatErrors = flattenErrors(errors);

          return (
            <>
              {getKeys(errors).length > 0 && (
                <ErrorAlert
                  testId="formik-validation-errors"
                  classNames="margin-top-3"
                  heading={miscellaneousT('checkAndFix')}
                >
                  {getKeys(flatErrors).map(key => {
                    return (
                      <ErrorAlertMessage
                        key={`Error.${key}`}
                        errorKey={`${key}`}
                        message={flatErrors[key]}
                      />
                    );
                  })}
                </ErrorAlert>
              )}

              <ConfirmLeave />

              <Form
                className="desktop:grid-col-6 margin-top-6"
                data-testid="ops-eval-and-learning-iddoc-testing-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <h3>{opsEvalAndLearningMiscT('testingQuestions')}</h3>

                  <Alert
                    type="info"
                    slim
                    data-testid="mandatory-fields-alert"
                    className="margin-bottom-4"
                  >
                    <span className="mandatory-fields-alert__text">
                      {opsEvalAndLearningMiscT('ssmRequest')}
                    </span>
                  </Alert>

                  <FieldGroup
                    scrollElement="ops-eval-and-learning-uat-needs"
                    className="margin-top-6"
                    error={!!flatErrors.uatNeeds}
                  >
                    <Label htmlFor="ops-eval-and-learning-uat-needs">
                      {opsEvalAndLearningT('uatNeeds.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.uatNeeds}</FieldErrorMsg>

                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="ops-eval-and-learning-uat-needs"
                      name="uatNeeds"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="ops-eval-and-learning-stc-needs"
                    className="margin-top-6"
                    error={!!flatErrors.stcNeeds}
                  >
                    <Label htmlFor="ops-eval-and-learning-stc-needs">
                      {opsEvalAndLearningT('stcNeeds.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.stcNeeds}</FieldErrorMsg>

                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="ops-eval-and-learning-stc-needs"
                      data-testid="ops-eval-and-learning-stc-needs"
                      name="stcNeeds"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="ops-eval-and-learning-testing-timelines"
                    className="margin-top-6"
                    error={!!flatErrors.testingTimelines}
                  >
                    <Label htmlFor="ops-eval-and-learning-testing-timelines">
                      {opsEvalAndLearningT('testingTimelines.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.testingTimelines}</FieldErrorMsg>

                    <Field
                      as={TextAreaField}
                      className="height-15"
                      id="ops-eval-and-learning-testing-timelines"
                      name="testingTimelines"
                    />
                  </FieldGroup>

                  <AddNote
                    id="ops-eval-and-learning-testing-note"
                    field="testingNote"
                  />

                  <h3>{opsEvalAndLearningMiscT('dataMonitoring')}</h3>

                  <FieldGroup scrollElement="ops-eval-and-learning-data-monitoring-file">
                    <Label htmlFor="ops-eval-and-learning-data-monitoring-file">
                      {opsEvalAndLearningT('dataMonitoringFileTypes.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.dataMonitoringFileTypes}
                    </FieldErrorMsg>

                    {getKeys(dataMonitoringFileTypesConfig.options).map(
                      type => {
                        return (
                          <Fragment key={type}>
                            <Field
                              as={CheckboxField}
                              id={`ops-eval-and-learning-data-monitoring-file-${type}`}
                              name="dataMonitoringFileTypes"
                              label={
                                dataMonitoringFileTypesConfig.options[type]
                              }
                              value={type}
                              checked={values?.dataMonitoringFileTypes.includes(
                                type
                              )}
                            />

                            {type === MonitoringFileType.OTHER &&
                              values.dataMonitoringFileTypes.includes(
                                MonitoringFileType.OTHER
                              ) && (
                                <div className="margin-left-4">
                                  <Label
                                    htmlFor="ops-eval-and-learning-data-monitoring-file-other"
                                    className="text-normal"
                                  >
                                    {opsEvalAndLearningT(
                                      'dataMonitoringFileOther.label'
                                    )}
                                  </Label>

                                  <FieldErrorMsg>
                                    {flatErrors.dataMonitoringFileOther}
                                  </FieldErrorMsg>

                                  <Field
                                    as={TextInput}
                                    id="ops-eval-and-learning-data-monitoring-file-other"
                                    name="dataMonitoringFileOther"
                                  />
                                </div>
                              )}
                          </Fragment>
                        );
                      }
                    )}
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="ops-eval-and-learning-data-response-type"
                    className="margin-top-6"
                    error={!!flatErrors.dataResponseType}
                  >
                    <Label htmlFor="ops-eval-and-learning-data-response-type">
                      {opsEvalAndLearningT('dataResponseType.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.dataResponseType}</FieldErrorMsg>

                    <Field
                      as={TextInput}
                      id="ops-eval-and-learning-data-response-type"
                      maxLength={50}
                      name="dataResponseType"
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="ops-eval-and-learning-data-file-frequency"
                    className="margin-top-6"
                    error={!!flatErrors.dataResponseFileFrequency}
                  >
                    <Label htmlFor="ops-eval-and-learning-data-file-frequency">
                      {opsEvalAndLearningT('dataResponseFileFrequency.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.dataResponseFileFrequency}
                    </FieldErrorMsg>

                    <Field
                      as={TextInput}
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
                        history.push(
                          `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/iddoc`
                        );
                      }}
                    >
                      {miscellaneousT('back')}
                    </Button>

                    <Button type="submit" onClick={() => setErrors({})}>
                      {miscellaneousT('next')}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    className="usa-button usa-button--unstyled"
                    onClick={() =>
                      history.push(
                        `/models/${modelID}/collaboration-area/task-list`
                      )
                    }
                  >
                    <Icon.ArrowBack className="margin-right-1" aria-hidden />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
              </Form>
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
