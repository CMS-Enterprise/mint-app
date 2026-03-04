import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Fieldset,
  GridContainer,
  Icon,
  Label,
  Radio
} from '@trussworks/react-uswds';
import { NotFoundPartial } from 'features/NotFound';
import { Field, Formik, FormikProps } from 'formik';
import {
  GetPerformanceQuery,
  TypedUpdatePlanOpsEvalAndLearningDocument,
  useGetPerformanceQuery
} from 'gql/generated/graphql';

import AddNote from 'components/AddNote';
import Alert from 'components/Alert';
import AskAQuestion from 'components/AskAQuestion';
import BooleanRadio from 'components/BooleanRadioForm';
import Breadcrumbs, { BreadcrumbItemOptions } from 'components/Breadcrumbs';
import ConfirmLeave from 'components/ConfirmLeave';
import FieldGroup from 'components/FieldGroup';
import MainContent from 'components/MainContent';
import MINTForm from 'components/MINTForm';
import MTOWarning from 'components/MTOWarning';
import MutationErrorModal from 'components/MutationErrorModal';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import StickyModelNameWrapper from 'components/StickyModelNameWrapper';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import useScrollElement from 'hooks/useScrollElement';
import useStickyHeader from 'hooks/useStickyHeader';
import { getKeys } from 'types/translation';

import {
  isCCWInvolvement,
  isQualityMeasures,
  renderCurrentPage,
  renderTotalPages
} from '../Support';

type PerformanceFormType =
  GetPerformanceQuery['modelPlan']['opsEvalAndLearning'];

const Performance = () => {
  const { t: opsEvalAndLearningT } = useTranslation('opsEvalAndLearning');

  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );
  const { t: miscellaneousT } = useTranslation('miscellaneous');

  const {
    benchmarkForPerformance: benchmarkForPerformanceConfig,
    computePerformanceScores: computePerformanceScoresConfig,
    riskAdjustPerformance: riskAdjustPerformanceConfig,
    riskAdjustFeedback: riskAdjustFeedbackConfig,
    riskAdjustPayments: riskAdjustPaymentsConfig,
    riskAdjustOther: riskAdjustOtherConfig,
    appealPerformance: appealPerformanceConfig,
    appealFeedback: appealFeedbackConfig,
    appealPayments: appealPaymentsConfig,
    appealOther: appealOtherConfig
  } = usePlanTranslation('opsEvalAndLearning');

  const { modelID = '' } = useParams<{ modelID: string }>();

  const formikRef = useRef<FormikProps<PerformanceFormType>>(null);
  const navigate = useNavigate();
  const { headerRef, modelName, abbreviation } = useStickyHeader();

  const { data, loading, error } = useGetPerformanceQuery({
    variables: {
      id: modelID
    }
  });

  const {
    id,
    ccmInvolvment,
    dataNeededForMonitoring,
    benchmarkForPerformance,
    benchmarkForPerformanceNote,
    computePerformanceScores,
    computePerformanceScoresNote,
    riskAdjustPerformance,
    riskAdjustFeedback,
    riskAdjustPayments,
    riskAdjustOther,
    riskAdjustNote,
    appealPerformance,
    appealFeedback,
    appealPayments,
    appealOther,
    appealNote
  } = (data?.modelPlan?.opsEvalAndLearning || {}) as PerformanceFormType;

  // If redirected from Operational Solutions, scrolls to the relevant question
  useScrollElement(!loading);

  const { mutationError } = useHandleMutation(
    TypedUpdatePlanOpsEvalAndLearningDocument,
    {
      id,
      formikRef: formikRef as any
    }
  );

  const initialValues: PerformanceFormType = {
    __typename: 'PlanOpsEvalAndLearning',
    id: id ?? '',
    ccmInvolvment: ccmInvolvment ?? [],
    dataNeededForMonitoring: dataNeededForMonitoring ?? [],
    benchmarkForPerformance: benchmarkForPerformance ?? null,
    benchmarkForPerformanceNote: benchmarkForPerformanceNote ?? '',
    computePerformanceScores: computePerformanceScores ?? null,
    computePerformanceScoresNote: computePerformanceScoresNote ?? '',
    riskAdjustPerformance: riskAdjustPerformance ?? null,
    riskAdjustFeedback: riskAdjustFeedback ?? null,
    riskAdjustPayments: riskAdjustPayments ?? null,
    riskAdjustOther: riskAdjustOther ?? null,
    riskAdjustNote: riskAdjustNote ?? '',
    appealPerformance: appealPerformance ?? null,
    appealFeedback: appealFeedback ?? null,
    appealPayments: appealPayments ?? null,
    appealOther: appealOther ?? null,
    appealNote: appealNote ?? ''
  };

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <MainContent data-testid="ops-eval-and-learning-performance">
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

        <PageHeading className="margin-top-4 margin-bottom-2" ref={headerRef}>
          {opsEvalAndLearningMiscT('heading')}
        </PageHeading>

        <p
          className="margin-top-0 margin-bottom-1 font-body-lg"
          data-testid="model-plan-name"
        >
          {miscellaneousT('for')} {modelName}
        </p>
      </GridContainer>
      <StickyModelNameWrapper
        triggerRef={headerRef}
        sectionHeading={opsEvalAndLearningMiscT('heading')}
        modelName={modelName}
        abbreviation={abbreviation || undefined}
      />

      <GridContainer>
        <p className="margin-bottom-2 font-body-md line-height-sans-4">
          {miscellaneousT('helpText')}
        </p>

        <AskAQuestion modelID={modelID} />

        <Formik
          initialValues={initialValues}
          onSubmit={() => {
            navigate(
              `/models/${modelID}/collaboration-area/model-plan/ops-eval-and-learning/evaluation`
            );
          }}
          enableReinitialize
          innerRef={formikRef}
        >
          {(formikProps: FormikProps<PerformanceFormType>) => {
            const { handleSubmit, setErrors, values, setFieldValue } =
              formikProps;

            return (
              <>
                <ConfirmLeave />

                <MINTForm
                  className="desktop:grid-col-6 margin-top-6"
                  data-testid="ops-eval-and-learning-performance-form"
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    handleSubmit(e);
                  }}
                >
                  <Fieldset disabled={!!error || loading}>
                    <FieldGroup scrollElement="benchmarkForPerformance">
                      <Label htmlFor="ops-eval-and-learning-benchmark-performance">
                        {opsEvalAndLearningT('benchmarkForPerformance.label')}
                      </Label>

                      <MTOWarning id="ops-eval-and-learning-benchmark-performance-warning" />

                      <Fieldset>
                        {getKeys(benchmarkForPerformanceConfig.options).map(
                          key => (
                            <Field
                              as={Radio}
                              key={key}
                              id={`ops-eval-and-learning-benchmark-performance-${key}`}
                              name="dataFullTimeOrIncremental"
                              label={benchmarkForPerformanceConfig.options[key]}
                              value={key}
                              checked={values.benchmarkForPerformance === key}
                              onChange={() => {
                                setFieldValue('benchmarkForPerformance', key);
                              }}
                            />
                          )
                        )}
                      </Fieldset>

                      <AddNote
                        id="ops-eval-and-learning-benchmark-performance-note"
                        field="benchmarkForPerformanceNote"
                      />
                    </FieldGroup>

                    <FieldGroup className="margin-top-6">
                      <Label htmlFor="ops-eval-and-learning-compute-performance">
                        {opsEvalAndLearningT('computePerformanceScores.label')}
                      </Label>

                      <BooleanRadio
                        field="computePerformanceScores"
                        id="ops-eval-and-learning-compute-performance"
                        value={values.computePerformanceScores}
                        setFieldValue={setFieldValue}
                        options={computePerformanceScoresConfig.options}
                      />

                      <AddNote
                        id="ops-eval-and-learning-compute-performance-note"
                        field="computePerformanceScoresNote"
                      />
                    </FieldGroup>

                    <FieldGroup className="margin-top-6">
                      <Label htmlFor="ops-eval-and-learning-risk-adjustments">
                        {opsEvalAndLearningMiscT('riskAdjustments')}
                      </Label>

                      <Label
                        htmlFor="ops-eval-and-learning-risk-adjustment-performance"
                        className="text-normal margin-top-2"
                      >
                        {opsEvalAndLearningT('riskAdjustPerformance.label')}
                      </Label>

                      <BooleanRadio
                        field="riskAdjustPerformance"
                        id="ops-eval-and-learning-risk-adjustment-performance"
                        value={values.riskAdjustPerformance}
                        setFieldValue={setFieldValue}
                        options={riskAdjustPerformanceConfig.options}
                      />

                      <Label
                        htmlFor="ops-eval-and-learning-risk-adjustment-feedback"
                        className="text-normal"
                      >
                        {opsEvalAndLearningT('riskAdjustFeedback.label')}
                      </Label>

                      <BooleanRadio
                        field="riskAdjustFeedback"
                        id="ops-eval-and-learning-risk-adjustment-feedback"
                        value={values.riskAdjustFeedback}
                        setFieldValue={setFieldValue}
                        options={riskAdjustFeedbackConfig.options}
                      />

                      <Label
                        htmlFor="ops-eval-and-learning-risk-adjustment-payment"
                        className="text-normal"
                      >
                        {opsEvalAndLearningT('riskAdjustPayments.label')}
                      </Label>

                      <BooleanRadio
                        field="riskAdjustPayments"
                        id="ops-eval-and-learning-risk-adjustment-payment"
                        value={values.riskAdjustPayments}
                        setFieldValue={setFieldValue}
                        options={riskAdjustPaymentsConfig.options}
                      />

                      <Label
                        htmlFor="ops-eval-and-learning-risk-adjustment-other"
                        className="text-normal"
                      >
                        {opsEvalAndLearningT('riskAdjustOther.label')}
                      </Label>

                      <BooleanRadio
                        field="riskAdjustOther"
                        id="ops-eval-and-learning-risk-adjustment-other"
                        value={values.riskAdjustOther}
                        setFieldValue={setFieldValue}
                        options={riskAdjustOtherConfig.options}
                      />

                      <AddNote
                        id="ops-eval-and-learning-risk-adjustment-note"
                        field="riskAdjustNote"
                      />
                    </FieldGroup>

                    <FieldGroup
                      className="margin-top-6"
                      scrollElement="participantAppeal"
                    >
                      <Label htmlFor="ops-eval-and-learning-appeals">
                        {opsEvalAndLearningMiscT('participantAppeal')}
                      </Label>

                      <MTOWarning
                        id="ops-eval-and-learning-appeal-performance-warning"
                        className="margin-top-2"
                      />

                      <Alert slim type="info">
                        {opsEvalAndLearningMiscT('appealsWarning')}
                      </Alert>

                      <Label
                        htmlFor="ops-eval-and-learning-appeal-performance"
                        className="text-normal margin-top-2"
                      >
                        {opsEvalAndLearningT('appealPerformance.label')}
                      </Label>

                      <BooleanRadio
                        field="appealPerformance"
                        id="ops-eval-and-learning-appeal-performance"
                        value={values.appealPerformance}
                        setFieldValue={setFieldValue}
                        options={appealPerformanceConfig.options}
                      />

                      <Label
                        htmlFor="ops-eval-and-learning-appeal-feedback"
                        className="text-normal"
                      >
                        {opsEvalAndLearningT('appealFeedback.label')}
                      </Label>

                      <BooleanRadio
                        field="appealFeedback"
                        id="ops-eval-and-learning-appeal-feedback"
                        value={values.appealFeedback}
                        setFieldValue={setFieldValue}
                        options={appealFeedbackConfig.options}
                      />

                      <Label
                        htmlFor="ops-eval-and-learning-appeal-payment"
                        className="text-normal"
                      >
                        {opsEvalAndLearningT('appealPayments.label')}
                      </Label>

                      <BooleanRadio
                        field="appealPayments"
                        id="ops-eval-and-learning-appeal-payment"
                        value={values.appealPayments}
                        setFieldValue={setFieldValue}
                        options={appealPaymentsConfig.options}
                      />

                      <Label
                        htmlFor="ops-eval-and-learning-appeal-other"
                        className="text-normal"
                      >
                        {opsEvalAndLearningT('appealOther.label')}
                      </Label>

                      <BooleanRadio
                        field="appealOther"
                        id="ops-eval-and-learning-appeal-other"
                        value={values.appealOther}
                        setFieldValue={setFieldValue}
                        options={appealOtherConfig.options}
                      />

                      <AddNote
                        id="ops-eval-and-learning-appeal-note"
                        field="appealNote"
                      />
                    </FieldGroup>

                    <div className="margin-top-6 margin-bottom-3">
                      <Button
                        type="button"
                        className="usa-button usa-button--outline margin-bottom-1"
                        onClick={() => {
                          navigate(
                            `/models/${modelID}/collaboration-area/model-plan/ops-eval-and-learning`
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
                          `/models/${modelID}/collaboration-area/model-plan`
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
              2,
              isCCWInvolvement(ccmInvolvment) ||
                isQualityMeasures(dataNeededForMonitoring)
            )}
            totalPages={renderTotalPages(
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

export default Performance;
