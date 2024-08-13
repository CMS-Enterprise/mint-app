import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  Icon,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  GetIddocMonitoringQuery,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetIddocMonitoringQuery
} from 'gql/gen/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
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

type IDDOCMonitoringFormType = GetIddocMonitoringQuery['modelPlan']['opsEvalAndLearning'];

const IDDOCMonitoring = () => {
  const { t: opsEvalAndLearningT } = useTranslation('opsEvalAndLearning');

  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    dataFullTimeOrIncremental: dataFullTimeOrIncrementalConfig,
    eftSetUp: eftSetUpConfig,
    unsolicitedAdjustmentsIncluded: unsolicitedAdjustmentsIncludedConfig,
    dataFlowDiagramsNeeded: dataFlowDiagramsNeededConfig,
    produceBenefitEnhancementFiles: produceBenefitEnhancementFilesConfig
  } = usePlanTranslation('opsEvalAndLearning');

  const { modelID } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<IDDOCMonitoringFormType>>(null);
  const history = useHistory();

  const { data, loading, error } = useGetIddocMonitoringQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    iddocSupport,
    ccmInvolvment,
    dataNeededForMonitoring,
    dataFullTimeOrIncremental,
    eftSetUp,
    unsolicitedAdjustmentsIncluded,
    dataFlowDiagramsNeeded,
    produceBenefitEnhancementFiles,
    fileNamingConventions,
    dataMonitoringNote
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as IDDOCMonitoringFormType;

  const modelName = data?.modelPlan?.modelName || '';

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef
    }
  );

  const initialValues: IDDOCMonitoringFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    iddocSupport: iddocSupport ?? null,
    dataFullTimeOrIncremental: dataFullTimeOrIncremental ?? null,
    eftSetUp: eftSetUp ?? null,
    unsolicitedAdjustmentsIncluded: unsolicitedAdjustmentsIncluded ?? null,
    dataFlowDiagramsNeeded: dataFlowDiagramsNeeded ?? null,
    produceBenefitEnhancementFiles: produceBenefitEnhancementFiles ?? null,
    fileNamingConventions: fileNamingConventions ?? '',
    dataMonitoringNote: dataMonitoringNote ?? ''
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
            `/models/${modelID}/task-list/ops-eval-and-learning/performance`
          );
        }}
        enableReinitialize
        innerRef={formikRef}
      >
        {(formikProps: FormikProps<IDDOCMonitoringFormType>) => {
          const {
            errors,
            handleSubmit,
            setErrors,
            values,
            setFieldValue
          } = formikProps;
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
                data-testid="ops-eval-and-learning-iddoc-monitoring-form"
                onSubmit={e => {
                  handleSubmit(e);
                }}
              >
                <Fieldset disabled={!!error || loading}>
                  <h3>{opsEvalAndLearningMiscT('dataMonitoringContinued')}</h3>

                  <FieldGroup
                    scrollElement="dataFullTimeOrIncremental"
                    error={!!flatErrors.dataFullTimeOrIncremental}
                  >
                    <Label htmlFor="ops-eval-and-learning-fulltime-or-incremental">
                      {opsEvalAndLearningT('dataFullTimeOrIncremental.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.dataFullTimeOrIncremental}
                    </FieldErrorMsg>

                    <Fieldset>
                      {getKeys(dataFullTimeOrIncrementalConfig.options).map(
                        key => (
                          <Field
                            as={Radio}
                            key={key}
                            id={`ops-eval-and-learning-fulltime-or-incremental-${key}`}
                            name="dataFullTimeOrIncremental"
                            label={dataFullTimeOrIncrementalConfig.options[key]}
                            value={key}
                            checked={values.dataFullTimeOrIncremental === key}
                            onChange={() => {
                              setFieldValue('dataFullTimeOrIncremental', key);
                            }}
                          />
                        )
                      )}
                    </Fieldset>
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="eftSetUp"
                    error={!!flatErrors.eftSetUp}
                    className="margin-top-6"
                  >
                    <Label htmlFor="ops-eval-and-learning-eft-setup">
                      {opsEvalAndLearningT('eftSetUp.label')}
                    </Label>

                    <FieldErrorMsg>{flatErrors.eftSetUp}</FieldErrorMsg>

                    <BooleanRadio
                      field="eftSetUp"
                      id="ops-eval-and-learning-eft-setup"
                      value={values.eftSetUp}
                      setFieldValue={setFieldValue}
                      options={eftSetUpConfig.options}
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="unsolicitedAdjustmentsIncluded"
                    error={!!flatErrors.unsolicitedAdjustmentsIncluded}
                    className="margin-top-6"
                  >
                    <Label htmlFor="ops-eval-and-learning-unsolicted-adjustment-included">
                      {opsEvalAndLearningT(
                        'unsolicitedAdjustmentsIncluded.label'
                      )}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.unsolicitedAdjustmentsIncluded}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="unsolicitedAdjustmentsIncluded"
                      id="ops-eval-and-learning-unsolicted-adjustment-included"
                      value={values.unsolicitedAdjustmentsIncluded}
                      setFieldValue={setFieldValue}
                      options={unsolicitedAdjustmentsIncludedConfig.options}
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="dataFlowDiagramsNeeded"
                    error={!!flatErrors.dataFlowDiagramsNeeded}
                    className="margin-top-6"
                  >
                    <Label htmlFor="ops-eval-and-learning-diagrams-needed">
                      {opsEvalAndLearningT('dataFlowDiagramsNeeded.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.dataFlowDiagramsNeeded}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="dataFlowDiagramsNeeded"
                      id="ops-eval-and-learning-diagrams-needed"
                      value={values.dataFlowDiagramsNeeded}
                      setFieldValue={setFieldValue}
                      options={dataFlowDiagramsNeededConfig.options}
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="produceBenefitEnhancementFiles"
                    error={!!flatErrors.produceBenefitEnhancementFiles}
                    className="margin-top-6"
                  >
                    <Label htmlFor="ops-eval-and-learning-produce-benefit-files">
                      {opsEvalAndLearningT(
                        'produceBenefitEnhancementFiles.label'
                      )}
                    </Label>

                    <p className="text-base margin-y-1">
                      {opsEvalAndLearningT(
                        'produceBenefitEnhancementFiles.sublabel'
                      )}
                    </p>

                    <FieldErrorMsg>
                      {flatErrors.produceBenefitEnhancementFiles}
                    </FieldErrorMsg>

                    <BooleanRadio
                      field="produceBenefitEnhancementFiles"
                      id="ops-eval-and-learning-produce-benefit-files"
                      value={values.produceBenefitEnhancementFiles}
                      setFieldValue={setFieldValue}
                      options={produceBenefitEnhancementFilesConfig.options}
                    />
                  </FieldGroup>

                  <FieldGroup
                    scrollElement="fileNamingConventions"
                    className="margin-top-6"
                    error={!!flatErrors.fileNamingConventions}
                  >
                    <Label htmlFor="ops-eval-and-learning-file-naming-convention">
                      {opsEvalAndLearningT('fileNamingConventions.label')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.fileNamingConventions}
                    </FieldErrorMsg>

                    <Field
                      as={TextInput}
                      id="ops-eval-and-learning-file-naming-convention"
                      data-testid="ops-eval-and-learning-file-naming-convention"
                      maxLength={50}
                      name="fileNamingConventions"
                    />
                  </FieldGroup>

                  <AddNote
                    id="ops-eval-and-learning-data-monitoring-note"
                    field="dataMonitoringNote"
                  />

                  <div className="margin-top-6 margin-bottom-3">
                    <Button
                      type="button"
                      className="usa-button usa-button--outline margin-bottom-1"
                      onClick={() => {
                        history.push(
                          `/models/${modelID}/task-list/ops-eval-and-learning/iddoc-testing`
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
                    onClick={() => history.push(`/models/${modelID}/task-list`)}
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
            4,
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

export default IDDOCMonitoring;
