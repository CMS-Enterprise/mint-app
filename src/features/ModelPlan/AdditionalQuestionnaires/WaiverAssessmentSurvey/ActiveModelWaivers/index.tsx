import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Fieldset,
  Form,
  FormGroup,
  Label,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import NotFoundPartial from 'features/NotFound/NotFoundPartial';
import {
  GetActiveModelWaiversQuery,
  TypedUpdateWaiverAssessmentSurveyDocument,
  useGetActiveModelWaiversQuery
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

import WaiverSurveyQuestion from '../_components/WaiverSurveyQuestion';

type ActiveModelWaiversData =
  GetActiveModelWaiversQuery['modelPlan']['questionnaires']['waiverAssessmentSurvey'];

type ActiveModelWaiversForm = Omit<ActiveModelWaiversData, '__typename' | 'id'>;

const defaultFormValues: ActiveModelWaiversForm = {
  modifiesMedicareSavingsPrograms: null,
  modifiesMedicareSavingsProgramsExample: '',
  modifiesMedicareSavingsProgramsWhyNot: null,
  bundlesPayments: null,
  bundlesPaymentsExample: '',
  bundlesPaymentsWhyNot: null,
  offersRiskSharingArrangements: null,
  offersRiskSharingArrangementsExample: '',
  offersRiskSharingArrangementsWhyNot: null,
  impactsSiteOfCarePayments: null,
  impactsSiteOfCarePaymentsExample: '',
  impactsSiteOfCarePaymentsWhyNot: null,
  modifiesCareTeamScopeOfPractice: null,
  modifiesCareTeamScopeOfPracticeExample: '',
  modifiesCareTeamScopeOfPracticeWhyNot: null,
  modifiesCareDeliveryWithClaimsBasedPayments: null,
  modifiesCareDeliveryWithClaimsBasedPaymentsExample: '',
  modifiesCareDeliveryWithClaimsBasedPaymentsWhyNot: null,
  modifiesQualityMeasurementsOrPaymentsViaWaivers: null,
  modifiesQualityMeasurementsOrPaymentsViaWaiversExample: '',
  modifiesQualityMeasurementsOrPaymentsViaWaiversWhyNot: null,
  impactsMedicaidOnlyBeneficiaries: null,
  impactsMedicaidOnlyBeneficiariesExample: '',
  impactsMedicaidOnlyBeneficiariesWhyNot: null,
  impactsHomeCommunityBasedServicePayments: null,
  impactsHomeCommunityBasedServicePaymentsExample: '',
  impactsHomeCommunityBasedServicePaymentsWhyNot: null,
  impactsManagedCareWaivers: null,
  impactsManagedCareWaiversExample: '',
  impactsManagedCareWaiversWhyNot: null,
  offersPatientIncentivesSafeHarborProtection: null,
  offersPatientIncentivesSafeHarborProtectionExample: '',
  offersPatientIncentivesSafeHarborProtectionWhyNot: null,
  offersExpensesRemunerationSafeHarborProtection: null,
  offersExpensesRemunerationSafeHarborProtectionExample: '',
  offersExpensesRemunerationSafeHarborProtectionWhyNot: null
};

const ActiveModelWaivers = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const {
    modifiesMedicareSavingsPrograms: modifiesMedicareSavingsProgramsConfig,
    bundlesPayments: bundlesPaymentsConfig,
    offersRiskSharingArrangements: offersRiskSharingArrangementsConfig,
    impactsSiteOfCarePayments: impactsSiteOfCarePaymentsConfig,
    modifiesCareTeamScopeOfPractice: modifiesCareTeamScopeOfPracticeConfig,
    modifiesCareDeliveryWithClaimsBasedPayments:
      modifiesCareDeliveryWithClaimsBasedPaymentsConfig,
    modifiesQualityMeasurementsOrPaymentsViaWaivers:
      modifiesQualityMeasurementsOrPaymentsViaWaiversConfig,
    impactsMedicaidOnlyBeneficiaries: impactsMedicaidOnlyBeneficiariesConfig,
    impactsHomeCommunityBasedServicePayments:
      impactsHomeCommunityBasedServicePaymentsConfig,
    impactsManagedCareWaivers: impactsManagedCareWaiversConfig,
    offersPatientIncentivesSafeHarborProtection:
      offersPatientIncentivesSafeHarborProtectionConfig,
    offersExpensesRemunerationSafeHarborProtection:
      offersExpensesRemunerationSafeHarborProtectionConfig
  } = usePlanTranslation('waiverAssessmentSurvey');

  const questionConfigs = [
    modifiesMedicareSavingsProgramsConfig,
    bundlesPaymentsConfig,
    offersRiskSharingArrangementsConfig,
    impactsSiteOfCarePaymentsConfig,
    modifiesCareTeamScopeOfPracticeConfig,
    modifiesCareDeliveryWithClaimsBasedPaymentsConfig,
    modifiesQualityMeasurementsOrPaymentsViaWaiversConfig,
    impactsMedicaidOnlyBeneficiariesConfig,
    impactsHomeCommunityBasedServicePaymentsConfig,
    impactsManagedCareWaiversConfig,
    offersPatientIncentivesSafeHarborProtectionConfig,
    offersExpensesRemunerationSafeHarborProtectionConfig
  ];

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const { data, loading, error } = useGetActiveModelWaiversQuery({
    variables: {
      id: modelID
    },
    skip: !modelID
  });

  const mappedFormData = mapDefaultFormValues<
    ActiveModelWaiversForm & { id?: string }
  >(data?.modelPlan?.questionnaires.waiverAssessmentSurvey, {
    ...defaultFormValues,
    id: ''
  });

  const { id: waiverID, ...formData } = mappedFormData;

  const methods = useForm<ActiveModelWaiversForm>({
    values: formData,
    mode: 'onChange'
  });

  const { handleSubmit, watch, control } = methods;

  const { mutationError, loading: isSubmitting } =
    useHandleMutation<ActiveModelWaiversForm>(
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
        header={waiverAssessmentSurveyMiscT('activeModelWaivers.heading')}
        currentPage={3}
        totalPages={5}
      />

      <p className="margin-top-neg-1 margin-bottom-4 text-base-dark">
        {waiverAssessmentSurveyMiscT('activeModelWaivers.description')}
      </p>

      <div>
        <FormProvider {...methods}>
          <MutationErrorModal
            isOpen={mutationError.isModalOpen}
            closeModal={mutationError.closeModal}
            url={mutationError.destinationURL}
          />

          <Form
            id="waiver-assessment-survey-active-model-waivers-form"
            data-testid="waiver-assessment-survey-active-model-waivers-form"
            className="maxw-none"
            onSubmit={handleSubmit(() => {
              navigate(
                `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/waiver-selection-and-confirmation`
              );
            })}
          >
            <Fieldset>
              <ConfirmLeaveRHF />

              <div className="tablet:grid-col-6 margin-bottom-6">
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

                    <Controller
                      name={
                        questionConfig.gqlField as keyof ActiveModelWaiversForm
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

              <div className="bg-info-lighter padding-3">
                <SummaryBoxHeading
                  headingLevel="h2"
                  className="margin-bottom-2"
                >
                  {waiverAssessmentSurveyMiscT('availableWaivers.heading')}
                </SummaryBoxHeading>

                <p className="line-height-sans-5 margin-top-0 margin-bottom-2 text-base-darkest">
                  {waiverAssessmentSurveyMiscT('availableWaivers.description', {
                    count:
                      data?.modelPlan?.waiverInfo?.commonWaivers?.length ?? 0
                  })}
                </p>
              </div>

              <FormFooter
                id="waiver-assessment-survey-active-model-waivers-form"
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
        <PageNumber currentPage={3} totalPages={5} className="margin-y-6" />
      </div>
    </div>
  );
};

export default ActiveModelWaivers;
