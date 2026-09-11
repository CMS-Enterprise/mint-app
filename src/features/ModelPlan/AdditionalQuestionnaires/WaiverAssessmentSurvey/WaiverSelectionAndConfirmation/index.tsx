import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useBlocker, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Fieldset, Form } from '@trussworks/react-uswds';
import NotFoundPartial from 'features/NotFound/NotFoundPartial';
import {
  CommonWaiverType,
  GetWaiversDocument,
  TypedUpdateSelectedWaiversDocument,
  useGetWaiversQuery
} from 'gql/generated/graphql';

import ConfirmLeaveRHF from 'components/ConfirmLeave/ConfirmLeaveRHF';
import FormFooter from 'components/FormFooter';
import FormHeader from 'components/FormHeader';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import Spinner from 'components/Spinner';
import { useErrorMessage } from 'contexts/ErrorContext';
import { WaiverSelectionForm } from 'types/waivers';

import WaiverInfoPanel from '../_components/WaiverInfoPanel';
import WaiverSelectionSection from '../_components/WaiverSelectionSection';
import { getWaiversMockData, MOCK_WAIVERS_ENABLED } from '../mockWaiversData';
import {
  buildWaiverSelectionFormValues,
  getWaiverSelectionChanges
} from '../util';

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

  useErrorMessage('skip', true);

  const [destinationURL, setDestinationURL] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError
  } = useGetWaiversQuery({
    variables: {
      id: modelID
    },
    skip: !modelID || MOCK_WAIVERS_ENABLED
  });

  const data = MOCK_WAIVERS_ENABLED ? getWaiversMockData(modelID) : queryData;
  const loading = MOCK_WAIVERS_ENABLED ? false : queryLoading;
  const error = MOCK_WAIVERS_ENABLED ? undefined : queryError;

  const formData = useMemo(
    () => buildWaiverSelectionFormValues(data?.modelPlan),
    [data?.modelPlan]
  );

  const methods = useForm<WaiverSelectionForm>({
    values: formData,
    mode: 'onChange'
  });

  const { handleSubmit, getValues } = methods;

  const [updateSelectedWaivers, { loading: isSubmitting }] = useMutation(
    TypedUpdateSelectedWaiversDocument,
    {
      refetchQueries: [
        { query: GetWaiversDocument, variables: { id: modelID } }
      ]
    }
  );

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    if (isErrorModalOpen) {
      return false;
    }

    if (nextLocation.pathname.includes('locked-task-list-section')) {
      return false;
    }

    if (nextLocation.pathname === currentLocation.pathname) {
      return false;
    }

    const changes = getWaiverSelectionChanges(formData, getValues());

    if (changes.length === 0) {
      return false;
    }

    updateSelectedWaivers({
      variables: {
        modelPlanID: modelID,
        changes
      }
    })
      .then(response => {
        if (!response?.errors) {
          setDestinationURL(nextLocation.pathname);
          blocker?.proceed?.();
        } else {
          setDestinationURL(nextLocation.pathname);
          setIsErrorModalOpen(true);
        }
      })
      .catch(() => {
        setDestinationURL(nextLocation.pathname);
        setIsErrorModalOpen(true);
      });

    return true;
  });

  useEffect(() => {
    if (destinationURL && !isErrorModalOpen) {
      blocker?.proceed?.();
    }
  }, [destinationURL, blocker, isErrorModalOpen]);

  const closeErrorModal = ({
    clearDestination = true
  }: { clearDestination?: boolean } = {}) => {
    setIsErrorModalOpen(false);
    if (clearDestination) {
      setDestinationURL('');
    }
  };

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
          <WaiverInfoPanel />

          <MutationErrorModal
            isOpen={isErrorModalOpen}
            closeModal={closeErrorModal}
            url={destinationURL}
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
                  existingWaivers={
                    data.modelPlan.questionnaires.waiverAssessmentSurvey.waivers
                  }
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
