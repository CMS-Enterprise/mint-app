import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import SelectedWaiversTable from 'features/ModelPlan/ReadOnly/_components/SelectedWaiversTable';
import NotFoundPartial from 'features/NotFound/NotFoundPartial';
import { useGetAllWaiverAssessmentSurveyQuery } from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import FormHeader from 'components/FormHeader';
import Spinner from 'components/Spinner';

import WaiverAssessmentSurveyReadOnlySections from '../_components/WaiverAssessmentSurveyReadOnlySections';
import {
  getAllWaiverAssessmentSurveyMockData,
  MOCK_WAIVERS_ENABLED
} from '../mockWaiversData';

const ConfirmAndSubmit = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const { modelID = '' } = useParams<{ modelID: string }>();

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

  if (loading) {
    return <Spinner size="large" />;
  }

  if (error || !data?.modelPlan?.questionnaires?.waiverAssessmentSurvey) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  const waiverAssessmentSurveyData =
    data.modelPlan.questionnaires.waiverAssessmentSurvey;

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

      <h3 className="margin-bottom-2">
        {waiverAssessmentSurveyMiscT('selectedWaivers.heading')}
      </h3>

      {waiverAssessmentSurveyData.waivers.length === 0 ? (
        <Alert type="info" slim className="margin-bottom-6">
          {waiverAssessmentSurveyMiscT('modelHasNotSelectedWaiver')}
        </Alert>
      ) : (
        <SelectedWaiversTable
          selectedWaivers={waiverAssessmentSurveyData.waivers}
        />
      )}

      <WaiverAssessmentSurveyReadOnlySections modelPlan={data.modelPlan} />
    </div>
  );
};

export default ConfirmAndSubmit;
