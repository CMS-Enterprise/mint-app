import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Form,
  Link,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import SelectedWaiversTable from 'features/ModelPlan/ReadOnly/_components/SelectedWaiversTable';
import NotFoundPartial from 'features/NotFound/NotFoundPartial';
import {
  useGetAllWaiverAssessmentSurveyQuery,
  useUpdateWaiverAssessmentSurveyMutation,
  WaiverAssessmentSurveyStatus
} from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import FormHeader from 'components/FormHeader';
import MutationErrorModal from 'components/MutationErrorModal';
import PageNumber from 'components/PageNumber';
import Spinner from 'components/Spinner';

import WaiverAssessmentSurveyReadOnlySections from '../_components/WaiverAssessmentSurveyReadOnlySections';
import {
  getAllWaiverAssessmentSurveyMockData,
  MOCK_WAIVERS_ENABLED
} from '../mockWaiversData';
import { isWaiverSurveyQuestionsComplete } from '../util';

const ConfirmAndSubmit = () => {
  const { t: miscellaneousT } = useTranslation('miscellaneous');
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );
  const navigate = useNavigate();

  const { modelID = '' } = useParams<{ modelID: string }>();

  const [shouldSubmitForm, setShouldSubmitForm] = useState<boolean>(false);
  const [destinationURL, setDestinationURL] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError
  } = useGetAllWaiverAssessmentSurveyQuery({
    variables: {
      id: modelID
    },
    skip: !modelID || MOCK_WAIVERS_ENABLED
  });

  const data = MOCK_WAIVERS_ENABLED
    ? getAllWaiverAssessmentSurveyMockData(modelID)
    : queryData;

  const loading = MOCK_WAIVERS_ENABLED ? false : queryLoading;
  const error = MOCK_WAIVERS_ENABLED ? undefined : queryError;

  const waiverAssessmentSurveyData =
    data?.modelPlan?.questionnaires?.waiverAssessmentSurvey;

  const isSurveyComplete = waiverAssessmentSurveyData
    ? isWaiverSurveyQuestionsComplete(waiverAssessmentSurveyData)
    : false;

  const [updateWaiverAssessmentSurvey, { loading: isSubmitting }] =
    useUpdateWaiverAssessmentSurveyMutation();

  const homeRoute = `/models/${modelID}/collaboration-area/additional-questionnaires`;

  useEffect(() => {
    if (!isSurveyComplete) {
      setShouldSubmitForm(false);
    } else {
      setShouldSubmitForm(!!waiverAssessmentSurveyData?.isComplete);
    }
  }, [isSurveyComplete, waiverAssessmentSurveyData?.isComplete]);

  const handleFormSubmit = () => {
    if (!waiverAssessmentSurveyData) return;

    updateWaiverAssessmentSurvey({
      variables: {
        id: waiverAssessmentSurveyData.id,
        changes: {
          status: shouldSubmitForm
            ? WaiverAssessmentSurveyStatus.COMPLETE
            : WaiverAssessmentSurveyStatus.IN_PROGRESS
        }
      }
    })
      .then(response => {
        if (!response?.errors) {
          setDestinationURL(homeRoute);
        } else {
          setIsErrorModalOpen(true);
        }
      })
      .catch(() => {
        setIsErrorModalOpen(true);
      });
  };

  useEffect(() => {
    if (destinationURL && !isErrorModalOpen) {
      navigate(destinationURL);
    }
  }, [destinationURL, isErrorModalOpen, navigate]);

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

  if (error || !waiverAssessmentSurveyData) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  return (
    <div className="mint-body-normal">
      <FormHeader
        header={waiverAssessmentSurveyMiscT('confirmAndSubmit.heading')}
        currentPage={7}
        totalPages={7}
      />

      <p className="margin-top-neg-1 margin-bottom-5 text-base-dark">
        {waiverAssessmentSurveyMiscT('confirmAndSubmit.description')}
      </p>

      <MutationErrorModal
        isOpen={isErrorModalOpen}
        closeModal={closeErrorModal}
        url={destinationURL}
      />

      <h3 className="margin-bottom-2">
        {waiverAssessmentSurveyMiscT('selectedWaivers.heading')}
      </h3>

      <div className="margin-bottom-5">
        {waiverAssessmentSurveyData.waivers.length === 0 ? (
          <Alert type="info" slim>
            {waiverAssessmentSurveyMiscT('modelHasNotSelectedWaiver')}
          </Alert>
        ) : (
          <SelectedWaiversTable
            selectedWaivers={waiverAssessmentSurveyData.waivers}
          />
        )}
      </div>

      <WaiverAssessmentSurveyReadOnlySections modelPlan={data.modelPlan} />

      <SummaryBox className="maxw-tablet">
        <SummaryBoxHeading headingLevel="h2" className="margin-bottom-2">
          {waiverAssessmentSurveyMiscT('confirmAndSubmit.summaryBox.title')}
        </SummaryBoxHeading>
        <SummaryBoxContent>
          <p className="margin-0">
            <Trans
              i18nKey="waiverAssessmentSurveyMisc:confirmAndSubmit.summaryBox.text"
              components={{
                // TODO: Update link
                link1: <Link href="/">link</Link>
              }}
            />
          </p>
        </SummaryBoxContent>
      </SummaryBox>

      <Form
        id="waiver-assessment-survey-confirm-and-submit-form"
        data-testid="waiver-assessment-survey-confirm-and-submit-form"
        className="maxw-none"
        onSubmit={e => {
          e.preventDefault();
          handleFormSubmit();
        }}
      >
        <div className="margin-top-6 margin-bottom-3 maxw-tablet border-1px border-base-light radius-md padding-2">
          <p className="margin-y-0">
            {waiverAssessmentSurveyMiscT(
              'confirmAndSubmit.questionnaireStatus'
            )}
          </p>
          <CheckboxField
            name="shouldSubmitForm"
            id="should-submit-form"
            testid="should-submit-form"
            checked={shouldSubmitForm}
            disabled={!isSurveyComplete}
            value="true"
            label={waiverAssessmentSurveyMiscT(
              'confirmAndSubmit.questionnaireComplete'
            )}
            onChange={e => {
              setShouldSubmitForm(e.target.checked);
            }}
            onBlur={() => null}
          />
          {!isSurveyComplete && (
            <Alert type="warning" slim>
              {waiverAssessmentSurveyMiscT(
                'confirmAndSubmit.questionnaireStatusAlert'
              )}
            </Alert>
          )}
        </div>

        <div className="margin-top-6 margin-bottom-3 display-flex">
          <Button
            type="button"
            className="usa-button usa-button--outline margin-top-0"
            disabled={isSubmitting}
            onClick={() =>
              navigate(
                `/models/${modelID}/collaboration-area/additional-questionnaires/waiver-assessment-survey/waiver-selection-and-confirmation`
              )
            }
          >
            {miscellaneousT('back')}
          </Button>
          <Button
            type="submit"
            className="margin-top-0"
            disabled={isSubmitting}
          >
            {waiverAssessmentSurveyMiscT('confirmAndSubmit.saveAndExit')}
          </Button>
        </div>
      </Form>

      <PageNumber currentPage={7} totalPages={7} className="margin-y-6" />
    </div>
  );
};

export default ConfirmAndSubmit;
