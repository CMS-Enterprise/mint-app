import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Fieldset, Form, FormGroup, Label } from '@trussworks/react-uswds';
import NotFoundPartial from 'features/NotFound/NotFoundPartial';
import {
  GetMedicaidPaymentWaiversQuery,
  TypedUpdateWaiverAssessmentSurveyDocument,
  useGetMedicaidPaymentWaiversQuery
} from 'gql/generated/graphql';

import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormFooter from 'components/FormFooter';
import FormHeader from 'components/FormHeader';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import Spinner from 'components/Spinner';
import TextAreaField from 'components/TextAreaField';
import useHandleMutation from 'hooks/useHandleMutation';
import usePlanTranslation from 'hooks/usePlanTranslation';
import mapDefaultFormValues from 'utils/mapDefaultFormValues';
import { convertCamelCaseToKebabCase } from 'utils/modelPlan';

import SelectedWaiversSection from '../_components/SelectedWaiversSection';
import WaiverSurveyQuestion from '../_components/WaiverSurveyQuestion';

type MedicaidPaymentWaiversData =
  GetMedicaidPaymentWaiversQuery['modelPlan']['questionnaires']['waiverAssessmentSurvey'];

export type MedicaidPaymentSuggestedWaivers =
  MedicaidPaymentWaiversData['suggestedWaivers'];

export type MedicaidPaymentWaiversForm = Omit<
  MedicaidPaymentWaiversData,
  '__typename' | 'id' | 'suggestedWaivers'
>;

const defaultFormValues: MedicaidPaymentWaiversForm = {
  impactsMedicaidOnlyBeneficiaries: null,
  impactsMedicaidOnlyBeneficiariesExample: '',
  impactsMedicaidOnlyBeneficiariesWhyNot: null,
  impactsHomeCommunityBasedServicePayments: null,
  impactsHomeCommunityBasedServicePaymentsExample: '',
  impactsHomeCommunityBasedServicePaymentsWhyNot: null,
  impactsManagedCareWaivers: null,
  impactsManagedCareWaiversExample: '',
  impactsManagedCareWaiversWhyNot: null,
  additionalMedicaidSpecificWaivers: ''
};

const MedicaidPaymentWaivers = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const {
    impactsMedicaidOnlyBeneficiaries: impactsMedicaidOnlyBeneficiariesConfig,
    impactsHomeCommunityBasedServicePayments:
      impactsHomeCommunityBasedServicePaymentsConfig,
    impactsManagedCareWaivers: impactsManagedCareWaiversConfig,
    additionalMedicaidSpecificWaivers: additionalMedicaidSpecificWaiversConfig
  } = usePlanTranslation('waiverAssessmentSurvey');

  const questionConfigs = [
    impactsMedicaidOnlyBeneficiariesConfig,
    impactsHomeCommunityBasedServicePaymentsConfig,
    impactsManagedCareWaiversConfig
  ];

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const { data, loading, error } = useGetMedicaidPaymentWaiversQuery({
    variables: {
      id: modelID
    },
    skip: !modelID
  });

  const mappedFormData = mapDefaultFormValues<
    MedicaidPaymentWaiversForm & { id?: string } & {
      suggestedWaivers?: MedicaidPaymentSuggestedWaivers;
    }
  >(data?.modelPlan?.questionnaires.waiverAssessmentSurvey, {
    ...defaultFormValues,
    id: '',
    suggestedWaivers: []
  });

  const { id: waiverID, suggestedWaivers, ...formData } = mappedFormData;

  const methods = useForm<MedicaidPaymentWaiversForm>({
    values: formData,
    mode: 'onChange'
  });

  const { handleSubmit, watch, control } = methods;

  const { mutationError, loading: isSubmitting } =
    useHandleMutation<MedicaidPaymentWaiversForm>(
      TypedUpdateWaiverAssessmentSurveyDocument,
      {
        id: waiverID || '',
        rhfRef: {
          initialValues: formData,
          values: watch()
        }
      }
    );

  if (loading) {
    return <Spinner size="large" />;
  }

  if (error || !data?.modelPlan?.questionnaires?.waiverAssessmentSurvey?.id) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <div className="mint-body-normal">
      <FormHeader
        header={waiverAssessmentSurveyMiscT('medicaidPaymentWaivers.heading')}
        currentPage={5}
        totalPages={7}
      />

      <p className="margin-top-neg-1 margin-bottom-4 text-base-dark">
        {waiverAssessmentSurveyMiscT('medicaidPaymentWaivers.description')}
      </p>

      <div className="tablet:grid-col-6">
        <FormProvider {...methods}>
          <MutationErrorModal
            isOpen={mutationError.isModalOpen}
            closeModal={mutationError.closeModal}
            url={mutationError.destinationURL}
          />

          <Form
            id="waiver-assessment-survey-medicaid-payment-waivers-form"
            data-testid="waiver-assessment-survey-medicaid-payment-waivers-form"
            className="maxw-none"
            onSubmit={handleSubmit(() => {
              navigate(
                `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/waiver-selection-and-confirmation`
              );
            })}
          >
            <Fieldset>
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
                      <p className="text-base margin-bottom-neg-05 margin-top-1">
                        {questionConfig.sublabel}
                      </p>
                    )}

                    <Controller
                      name={
                        questionConfig.gqlField as keyof MedicaidPaymentWaiversForm
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
                selectedWaivers={suggestedWaivers || []}
                waiverType={waiverAssessmentSurveyMiscT(
                  'medicaidPaymentWaivers.waiverType'
                )}
              >
                <FormGroup
                  key={additionalMedicaidSpecificWaiversConfig.gqlField}
                  className="margin-top-2 margin-bottom-2"
                >
                  <Label
                    htmlFor={convertCamelCaseToKebabCase(
                      additionalMedicaidSpecificWaiversConfig.gqlField
                    )}
                    className="text-normal text-bold"
                  >
                    {additionalMedicaidSpecificWaiversConfig.label}
                  </Label>
                  <Controller
                    name={
                      additionalMedicaidSpecificWaiversConfig.gqlField as 'additionalMedicaidSpecificWaivers'
                    }
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                      <TextAreaField
                        {...field}
                        id={convertCamelCaseToKebabCase(field.name)}
                        data-testid={convertCamelCaseToKebabCase(field.name)}
                        maxLength={5000}
                        className="height-card"
                        value={field.value ?? ''}
                      />
                    )}
                  />
                </FormGroup>
              </SelectedWaiversSection>

              <FormFooter
                id="waiver-assessment-survey-medicaid-payment-waivers-form"
                homeArea={additionalQuestionnairesT(
                  'saveAndReturnToQuestionnaires'
                )}
                homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
                backPage={`/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/program-waivers`}
                nextPage
                disabled={isSubmitting}
              />
            </Fieldset>
          </Form>
        </FormProvider>
        <PageNumber currentPage={5} totalPages={7} className="margin-y-6" />
      </div>
    </div>
  );
};

export default MedicaidPaymentWaivers;
