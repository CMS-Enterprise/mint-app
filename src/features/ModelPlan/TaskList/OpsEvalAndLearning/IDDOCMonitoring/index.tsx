import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  GridContainer,
  Icon,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  GetIddocMonitoringQuery,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetIddocMonitoringQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { getKeys } from 'types/translation';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '../Support';

type IDDOCMonitoringFormType =
  GetIddocMonitoringQuery['modelPlan']['opsEvalAndLearning'];

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

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<IDDOCMonitoringFormType>>(null);
  const navigate = useNavigate();

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
      formikRef: formikRef as any
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
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <MainContent data-testid="ops-eval-and-learning-iddoc-monitoring">
      <GridContainer>
        <MutationErrorModal
          isOpen={mutationError.isModalOpen}
          closeModal={mutationError.closeModal}
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
            navigate(
              `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/performance`
            );
          }}
          enableReinitialize
          innerRef={formikRef}
        >
          {(formikProps: FormikProps<IDDOCMonitoringFormType>) => {
            const { handleSubmit, setErrors, values, setFieldValue } =
              formikProps;

            return (
              <>
                <ConfirmLeave />

                <MINTForm
                  className="desktop:grid-col-6 margin-top-6"
                  data-testid="ops-eval-and-learning-iddoc-monitoring-form"
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    handleSubmit(e);
                  }}
                >
                  <Fieldset disabled={!!error || loading}>
                    <h3>
                      {opsEvalAndLearningMiscT('dataMonitoringContinued')}
                    </h3>

                    <FieldGroup>
                      <Label htmlFor="ops-eval-and-learning-fulltime-or-incremental">
                        {opsEvalAndLearningT('dataFullTimeOrIncremental.label')}
                      </Label>

                      <Fieldset>
                        {getKeys(dataFullTimeOrIncrementalConfig.options).map(
                          key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`ops-eval-and-learning-fulltime-or-incremental-${key}`}
                              name="dataFullTimeOrIncremental"
                              label={
                                dataFullTimeOrIncrementalConfig.options[key]
                              }
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

                    <FieldGroup className="margin-top-6">
                      <Label htmlFor="ops-eval-and-learning-eft-setup">
                        {opsEvalAndLearningT('eftSetUp.label')}
                      </Label>

                      <BooleanRadio
                        field="eftSetUp"
                        id="ops-eval-and-learning-eft-setup"
                        value={values.eftSetUp}
                        setFieldValue={setFieldValue}
                        options={eftSetUpConfig.options}
                      />
                    </FieldGroup>

                    <FieldGroup className="margin-top-6">
                      <Label htmlFor="ops-eval-and-learning-unsolicted-adjustment-included">
                        {opsEvalAndLearningT(
                          'unsolicitedAdjustmentsIncluded.label'
                        )}
                      </Label>

                      <BooleanRadio
                        field="unsolicitedAdjustmentsIncluded"
                        id="ops-eval-and-learning-unsolicted-adjustment-included"
                        value={values.unsolicitedAdjustmentsIncluded}
                        setFieldValue={setFieldValue}
                        options={unsolicitedAdjustmentsIncludedConfig.options}
                      />
                    </FieldGroup>

                    <FieldGroup className="margin-top-6">
                      <Label htmlFor="ops-eval-and-learning-diagrams-needed">
                        {opsEvalAndLearningT('dataFlowDiagramsNeeded.label')}
                      </Label>

                      <BooleanRadio
                        field="dataFlowDiagramsNeeded"
                        id="ops-eval-and-learning-diagrams-needed"
                        value={values.dataFlowDiagramsNeeded}
                        setFieldValue={setFieldValue}
                        options={dataFlowDiagramsNeededConfig.options}
                      />
                    </FieldGroup>

                    <FieldGroup className="margin-top-6">
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

                      <BooleanRadio
                        field="produceBenefitEnhancementFiles"
                        id="ops-eval-and-learning-produce-benefit-files"
                        value={values.produceBenefitEnhancementFiles}
                        setFieldValue={setFieldValue}
                        options={produceBenefitEnhancementFilesConfig.options}
                      />
                    </FieldGroup>

                    <FieldGroup className="margin-top-6">
                      <Label htmlFor="ops-eval-and-learning-file-naming-convention">
                        {opsEvalAndLearningT('fileNamingConventions.label')}
                      </Label>

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
                          navigate(
                            `/models/${modelID}/collaboration-area/task-list/ops-eval-and-learning/iddoc-testing`
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
                        navigate(
                          `/models/${modelID}/collaboration-area/task-list`
                        )
                      }
                    >
                      <Icon.ArrowBack
                        className="margin-right-1"
                        aria-hidden
                        aria-label="back"
                      />

                      {miscellaneousT('saveAndReturn')}
                    </Button>
                  </Fieldset>
                </MINTForm>
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
      </GridContainer>
    </MainContent>
  );
};

export default IDDOCMonitoring;
