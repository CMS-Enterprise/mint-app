import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Form } from '@trussworks/react-uswds';

import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormFooter from 'components/FormFooter';
import FormHeader from 'components/FormHeader';
import PageNumber from 'components/PageNumber';

const MedicarePaymentWaivers = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const { modelID = '' } = useParams<{ modelID: string }>();

  return (
    <div className="mint-body-normal">
      <FormHeader
        header={waiverAssessmentSurveyMiscT('medicarePaymentWaivers.heading')}
        currentPage={3}
        totalPages={7}
      />

      <p className="margin-top-neg-1">
        {waiverAssessmentSurveyMiscT('medicarePaymentWaivers.description')}
      </p>

      <Form
        id="waiver-assessment-survey-medicare-payment-waivers-form"
        data-testid="waiver-assessment-survey-medicare-payment-waivers-form"
        className="maxw-none"
        onSubmit={() => {}}
      >
        <ConfirmLeaveRHF />

        <div>hello world</div>

        <FormFooter
          id="waiver-assessment-survey-medicare-payment-waivers-form"
          homeArea={additionalQuestionnairesT('saveAndReturnToQuestionnaires')}
          homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
          backPage={`/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/model-plan-questions`}
          nextPage
          // disabled={submitting}
        />
      </Form>

      <PageNumber currentPage={3} totalPages={7} className="margin-y-6" />
    </div>
  );
};

export default MedicarePaymentWaivers;
