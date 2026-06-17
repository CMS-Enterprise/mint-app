import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Fieldset, Form } from '@trussworks/react-uswds';
import NotFoundPartial from 'features/NotFound/NotFoundPartial';
import {
  CommonWaiverType,
  TypedUpdateSelectedWaiversDocument,
  useGetWaiversQuery
} from 'gql/generated/graphql';

import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormFooter from 'components/FormFooter';
import FormHeader from 'components/FormHeader';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import Spinner from 'components/Spinner';
import useHandleMutation from 'hooks/useHandleMutation';

import WaiverSelectionSection from '../_components/WaiverSelectionSection';

const ORDERED_WAIVER_TYPES = [
  CommonWaiverType.MEDICARE_PAYMENT,
  CommonWaiverType.PROGRAM_MEDICARE_BE,
  CommonWaiverType.MEDICAID_PAYMENT
];

const WaiverSelectionAndConfirmation = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const { t: additionalQuestionnairesT } = useTranslation(
    'additionalQuestionnaires'
  );

  const { modelID = '' } = useParams<{ modelID: string }>();

  const navigate = useNavigate();

  const { data, loading, error } = useGetWaiversQuery({
    variables: {
      id: modelID
    },
    skip: !modelID
  });

  const methods = useForm<any>({
    values: {},
    mode: 'onChange'
  });

  const {
    handleSubmit,
    watch,
    formState: { defaultValues }
  } = methods;

  const { mutationError, loading: isSubmitting } = useHandleMutation(
    TypedUpdateSelectedWaiversDocument,
    {
      id: modelID,
      rhfRef: {
        initialValues: defaultValues,
        values: watch()
      }
    }
  );

  if (loading) {
    return <Spinner size="large" />;
  }

  if (error || !data?.modelPlan?.questionnaires?.waiverAssessmentSurvey) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <div className="mint-body-normal">
      <FormHeader
        header={waiverAssessmentSurveyMiscT(
          'waiverSelectionAndConfirmation.heading'
        )}
        currentPage={6}
        totalPages={7}
      />

      <p className="margin-top-neg-1 margin-bottom-5 text-base-dark">
        {waiverAssessmentSurveyMiscT(
          'waiverSelectionAndConfirmation.description'
        )}
      </p>

      <div>
        <FormProvider {...methods}>
          <MutationErrorModal
            isOpen={mutationError.isModalOpen}
            closeModal={mutationError.closeModal}
            url={mutationError.destinationURL}
          />

          <Form
            id="waiver-assessment-survey-waiver-selection-and-confirmation-form"
            data-testid="waiver-assessment-survey-waiver-selection-and-confirmation-form"
            className="maxw-none"
            onSubmit={handleSubmit(() => {
              navigate(
                `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/confirm-your-waiver-selections`
              );
            })}
          >
            <Fieldset>
              <ConfirmLeaveRHF />

              {ORDERED_WAIVER_TYPES.map(waiverType => (
                <WaiverSelectionSection
                  key={waiverType}
                  waiverType={waiverType}
                  suggestedCommonWaivers={
                    data.modelPlan.waiverInfo.suggestedCommonWaivers
                  }
                  unusedWaivers={data.modelPlan.waiverInfo.unusedCommonWaivers}
                />
              ))}

              <FormFooter
                id="waiver-assessment-survey-waiver-selection-and-confirmation-form"
                homeArea={additionalQuestionnairesT(
                  'saveAndReturnToQuestionnaires'
                )}
                homeRoute={`/models/${modelID}/collaboration-area/additional-questionnaires`}
                backPage={`/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/medicaid-payment-waivers`}
                nextPage
                disabled={isSubmitting}
              />
            </Fieldset>
          </Form>
        </FormProvider>
        <PageNumber currentPage={6} totalPages={7} className="margin-y-6" />
      </div>
    </div>
  );
};

export default WaiverSelectionAndConfirmation;
