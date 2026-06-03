import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Fieldset, Form, FormGroup, Label } from '@trussworks/react-uswds';
import NotFoundPartial from 'features/NotFound/NotFoundPartial';
import {
  GetProgramWaiversQuery,
  TypedUpdateWaiverAssessmentSurveyDocument,
  useGetProgramWaiversQuery
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
import { filterSuggestedWaiversByType } from '../util';

type ProgramWaiversData =
  GetProgramWaiversQuery['modelPlan']['questionnaires']['waiverAssessmentSurvey'];

export type ProgramSuggestedWaivers = ProgramWaiversData['suggestedWaivers'];

export type ProgramWaiversForm = Omit<
  ProgramWaiversData,
  '__typename' | 'id' | 'suggestedWaivers'
>;

const defaultFormValues: ProgramWaiversForm = {
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
  modifiesQualityMeasurementsOrPaymentsViaWaiversWhyNot: null
};

const ProgramWaivers = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const {
    impactsSiteOfCarePayments: impactsSiteOfCarePaymentsConfig,
    modifiesCareTeamScopeOfPractice: modifiesCareTeamScopeOfPracticeConfig,
    modifiesCareDeliveryWithClaimsBasedPayments:
      modifiesCareDeliveryWithClaimsBasedPaymentsConfig,
    modifiesQualityMeasurementsOrPaymentsViaWaivers:
      modifiesQualityMeasurementsOrPaymentsViaWaiversConfig
  } = usePlanTranslation('waiverAssessmentSurvey');

  const questionConfigs = [
    impactsSiteOfCarePaymentsConfig,
    modifiesCareTeamScopeOfPracticeConfig,
    modifiesCareDeliveryWithClaimsBasedPaymentsConfig,
    modifiesQualityMeasurementsOrPaymentsViaWaiversConfig
  ];

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const { data, loading, error } = useGetProgramWaiversQuery({
    variables: {
      id: modelID
    },
    skip: !modelID
  });

  const mappedFormData = mapDefaultFormValues<
    ProgramWaiversForm & { id?: string } & {
      suggestedWaivers?: ProgramSuggestedWaivers;
    }
  >(data?.modelPlan?.questionnaires.waiverAssessmentSurvey, {
    ...defaultFormValues,
    id: '',
    suggestedWaivers: []
  });

  const { id: waiverID, suggestedWaivers, ...formData } = mappedFormData;

  const programSuggestedWaivers = filterSuggestedWaiversByType(
    suggestedWaivers || [],
    'PROGRAM_MEDICARE_BES'
  );

  const methods = useForm<ProgramWaiversForm>({
    values: formData,
    mode: 'onChange'
  });

  const { handleSubmit, watch, control } = methods;

  const { mutationError, loading: isSubmitting } =
    useHandleMutation<ProgramWaiversForm>(
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
        header={waiverAssessmentSurveyMiscT('programWaivers.heading')}
        currentPage={4}
        totalPages={7}
      />

      <p className="margin-top-neg-1 margin-bottom-4 text-base-dark">
        {waiverAssessmentSurveyMiscT('programWaivers.description')}
      </p>

      <div className="tablet:grid-col-6">
        <FormProvider {...methods}>
          <MutationErrorModal
            isOpen={mutationError.isModalOpen}
            closeModal={mutationError.closeModal}
            url={mutationError.destinationURL}
          />

          <Form
            id="waiver-assessment-survey-program-waivers-form"
            data-testid="waiver-assessment-survey-program-waivers-form"
            className="maxw-none"
            onSubmit={handleSubmit(() => {
              navigate(
                `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/medicaid-payment-waivers`
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
                      name={questionConfig.gqlField as keyof ProgramWaiversForm}
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
                selectedWaivers={programSuggestedWaivers || []}
                waiverType="PROGRAM_MEDICARE_BES"
                waiverTypeText={waiverAssessmentSurveyMiscT(
                  'programWaivers.waiverTypeText'
                )}
              />

              <FormFooter
                id="waiver-assessment-survey-program-waivers-form"
                homeArea={additionalQuestionnairesT(
                  'saveAndReturnToQuestionnaires'
                )}
                homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
                backPage={`/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/medicare-payment-waivers`}
                nextPage
                disabled={isSubmitting}
              />
            </Fieldset>
          </Form>
        </FormProvider>
        <PageNumber currentPage={4} totalPages={7} className="margin-y-6" />
      </div>
    </div>
  );
};

export default ProgramWaivers;
