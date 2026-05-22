import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Form } from '@trussworks/react-uswds';

import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormFooter from 'components/FormFooter';
import FormHeader from 'components/FormHeader';
import PageNumber from 'components/PageNumber';
import usePlanTranslation from 'hooks/usePlanTranslation';

import SelectedWaiversSection from '../_components/SelectedWaiversSection';
import WaiverSurveyQuestion from '../_components/WaiverSurveyQuestion';

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

  const methods = useForm<any>({
    defaultValues: {},
    mode: 'onChange'
  });

  const { control, handleSubmit, setValue } = methods;

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
            <ConfirmLeaveRHF />

            <div className="margin-bottom-6">
              {questionConfigs.map(questionConfig => (
                <WaiverSurveyQuestion
                  key={questionConfig.gqlField}
                  questionConfig={questionConfig}
                  control={control}
                  setValue={setValue}
                />
              ))}
            </div>

            <SelectedWaiversSection allWaivers={[]} />

            <FormFooter
              id="waiver-assessment-survey-medicare-payment-waivers-form"
              homeArea={additionalQuestionnairesT(
                'saveAndReturnToQuestionnaires'
              )}
              homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
              backPage={`/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/model-plan-questions`}
              nextPage
              // disabled={submitting}
            />
          </Form>
        </FormProvider>
        <PageNumber currentPage={3} totalPages={7} className="margin-y-6" />
      </div>
    </div>
  );
};

export default MedicarePaymentWaivers;
