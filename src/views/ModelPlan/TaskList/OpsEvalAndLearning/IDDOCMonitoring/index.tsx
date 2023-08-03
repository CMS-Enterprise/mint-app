import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  IconArrowBack,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import usePlanTranslation from 'hooks/usePlanTranslation';
import GetIDDOCMonitoring from 'queries/OpsEvalAndLearning/GetIDDOCMonitoring';
import {
  GetIDDOCMonitoring as GetIDDOCMonitoringType,
  GetIDDOCMonitoring_modelPlan_opsEvalAndLearning as IDDOCMonitoringFormType,
  GetIDDOCMonitoringVariables
} from 'queries/OpsEvalAndLearning/types/GetIDDOCMonitoring';
import { UpdatePlanOpsEvalAndLearningVariables } from 'queries/OpsEvalAndLearning/types/UpdatePlanOpsEvalAndLearning';
import UpdatePlanOpsEvalAndLearning from 'queries/OpsEvalAndLearning/UpdatePlanOpsEvalAndLearning';
import { getKeys } from 'types/translation';
import flattenErrors from 'utils/flattenErrors';
import { dirtyInput } from 'utils/formDiff';
import { NotFoundPartial } from 'views/NotFound';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '..';

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

  const { data, loading, error } = useQuery<
    GetIDDOCMonitoringType,
    GetIDDOCMonitoringVariables
  >(GetIDDOCMonitoring, {
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
  } = data?.modelPlan?.opsEvalAndLearning || ({} as IDDOCMonitoringFormType);

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
              `/models/${modelID}/task-list/ops-eval-and-learning/performance`
            );
          } else if (redirect === 'back') {
            history.push(
              `/models/${modelID}/task-list/ops-eval-and-learning/iddoc-testing`
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
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{miscellaneousT('home')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to={`/models/${modelID}/task-list/`}>
            <span>{miscellaneousT('tasklistBreadcrumb')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{opsEvalAndLearningMiscT('breadcrumb')}</Breadcrumb>
      </BreadcrumbBar>
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
          handleFormSubmit('next');
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
                      {opsEvalAndLearningT(
                        'dataFullTimeOrIncremental.question'
                      )}
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
                      {opsEvalAndLearningT('eftSetUp.question')}
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
                        'unsolicitedAdjustmentsIncluded.question'
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
                      {opsEvalAndLearningT('dataFlowDiagramsNeeded.question')}
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
                        'produceBenefitEnhancementFiles.question'
                      )}
                    </Label>

                    <p className="text-base margin-y-1">
                      {opsEvalAndLearningT(
                        'produceBenefitEnhancementFiles.hint'
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
                      {opsEvalAndLearningT('fileNamingConventions.question')}
                    </Label>

                    <FieldErrorMsg>
                      {flatErrors.fileNamingConventions}
                    </FieldErrorMsg>

                    <Field
                      as={TextInput}
                      error={!!flatErrors.fileNamingConventions}
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
                        handleFormSubmit('back');
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
                    onClick={() => handleFormSubmit('task-list')}
                  >
                    <IconArrowBack className="margin-right-1" aria-hidden />

                    {miscellaneousT('saveAndReturn')}
                  </Button>
                </Fieldset>
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
