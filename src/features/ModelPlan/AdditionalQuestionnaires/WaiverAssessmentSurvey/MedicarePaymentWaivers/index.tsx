import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Fieldset, Form, FormGroup, Label } from '@trussworks/react-uswds';
import NotFoundPartial from 'features/NotFound/NotFoundPartial';
import {
  GetMedicarePaymentWaiversQuery,
  TypedUpdateWaiverAssessmentSurveyDocument,
  useGetMedicarePaymentWaiversQuery
} from 'gql/generated/graphql';

import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormFooter from 'components/FormFooter';
import FormHeader from 'components/FormHeader';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import Spinner from 'components/Spinner';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

import SelectedWaiversSection from '../_components/SelectedWaiversSection';
import WaiverSurveyQuestion from '../_components/WaiverSurveyQuestion';

export type MedicarePaymentWaiversData =
  GetMedicarePaymentWaiversQuery['modelPlan']['questionnaires']['waiverAssessmentSurvey'];

export type SuggestedWaivers = MedicarePaymentWaiversData['suggestedWaivers'];

export type MedicarePaymentWaiversForm = Omit<
  MedicarePaymentWaiversData,
  '__typename' | 'id' | 'suggestedWaivers'
>;

const defaultFormValues: MedicarePaymentWaiversForm = {
  modifiesMedicareSavingsPrograms: null,
  modifiesMedicareSavingsProgramsExample: '',
  modifiesMedicareSavingsProgramsWhyNot: null,
  bundlesPayments: null,
  bundlesPaymentsExample: '',
  bundlesPaymentsWhyNot: null,
  offersRiskSharingArrangements: null,
  offersRiskSharingArrangementsExample: '',
  offersRiskSharingArrangementsWhyNot: null
};

const MedicarePaymentWaivers = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const {
    modifiesMedicareSavingsPrograms: modifiesMedicareSavingsProgramsConfig,
    bundlesPayments: bundlesPaymentsConfig,
    offersRiskSharingArrangements: offersRiskSharingArrangementsConfig
  } = usePlanTranslation('waiverAssessmentSurvey');

  const questionConfigs = [
    modifiesMedicareSavingsProgramsConfig,
    bundlesPaymentsConfig,
    offersRiskSharingArrangementsConfig
  ];

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const { data, loading, error } = useGetMedicarePaymentWaiversQuery({
    variables: {
      id: modelID
    },
    skip: !modelID
  });

  const mappedFormData = mapDefaultFormValues<
    MedicarePaymentWaiversForm & { id?: string } & {
      suggestedWaivers?: SuggestedWaivers;
    }
  >(data?.modelPlan?.questionnaires.waiverAssessmentSurvey, {
    ...defaultFormValues,
    id: '',
    suggestedWaivers: []
  });

  const { id: waiverID, suggestedWaivers, ...formData } = mappedFormData;

  const methods = useForm<MedicarePaymentWaiversForm>({
    values: formData,
    mode: 'onChange'
  });

  const { handleSubmit, watch, control } = methods;

  const { mutationError, loading: isSubmitting } =
    useHandleMutation<MedicarePaymentWaiversForm>(
      TypedUpdateWaiverAssessmentSurveyDocument,
      {
        id: waiverID || '',
        rhfRef: {
          initialValues: formData,
          values: watch()
        }
      }
    );

  if (loading || !data) {
    return <Spinner size="large" />;
  }

  if (error || !data.modelPlan?.questionnaires?.waiverAssessmentSurvey?.id) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <div className="mint-body-normal">
      <FormHeader
        header={waiverAssessmentSurveyMiscT('medicarePaymentWaivers.heading')}
        currentPage={3}
        totalPages={7}
      />

      <p className="margin-top-neg-1 margin-bottom-4 text-base-dark">
        {waiverAssessmentSurveyMiscT('medicarePaymentWaivers.description')}
      </p>

      <div className="tablet:grid-col-6">
        <FormProvider {...methods}>
          <MutationErrorModal
            isOpen={mutationError.isModalOpen}
            closeModal={mutationError.closeModal}
            url={mutationError.destinationURL}
          />

          <Form
            id="waiver-assessment-survey-medicare-payment-waivers-form"
            data-testid="waiver-assessment-survey-medicare-payment-waivers-form"
            className="maxw-none"
            onSubmit={handleSubmit(() => {
              navigate(
                `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/program-waivers`
              );
            })}
          >
            <Fieldset disabled={!!error || loading}>
              <ConfirmLeaveRHF />

              <div className="margin-bottom-6">
                {questionConfigs.map(questionConfig => (
                  <FormGroup
                    key={questionConfig.gqlField}
                    className="margin-top-0 margin-bottom-2"
                  >
                    <Label
                      htmlFor={`${convertCamelCaseToKebabCase(
                        questionConfig.gqlField
                      )}-true`}
                      className="text-normal text-bold"
                    >
                      {questionConfig.label}
                    </Label>

                    {questionConfig.sublabel && (
                      <p className="text-base margin-bottom-1 margin-top-1">
                        {questionConfig.sublabel}
                      </p>
                    )}

                    <Controller
                      name={
                        questionConfig.gqlField as keyof MedicarePaymentWaiversForm
                      }
                      control={control}
                      render={({ field: { ref, ...field } }) => (
                        <WaiverSurveyQuestion
                          key={field.name}
                          questionConfig={questionConfig}
                          fieldName={field.name}
                          value={field.value as boolean | null | undefined}
                          methods={methods}
                          inputRef={ref}
                        />
                      )}
                    />
                  </FormGroup>
                ))}
              </div>

              <SelectedWaiversSection
                allWaivers={suggestedWaivers || []}
                selectedWaivers={suggestedWaivers || []} // TODO replace with actual selected waivers logic
              />

              <FormFooter
                id="waiver-assessment-survey-medicare-payment-waivers-form"
                homeArea={additionalQuestionnairesT(
                  'saveAndReturnToQuestionnaires'
                )}
                homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
                backPage={`/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/model-plan-questions`}
                nextPage
                disabled={isSubmitting}
              />
            </Fieldset>
          </Form>
        </FormProvider>
        <PageNumber currentPage={3} totalPages={7} className="margin-y-6" />
      </div>
    </div>
  );
};

export default MedicarePaymentWaivers;
