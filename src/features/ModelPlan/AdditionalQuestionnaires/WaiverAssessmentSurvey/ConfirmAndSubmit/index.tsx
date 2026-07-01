import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import SelectedWaiversTable from 'features/ModelPlan/ReadOnly/_components/SelectedWaiversTable';
import NotFoundPartial from 'features/NotFound/NotFoundPartial';
import { useGetWaiversQuery } from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import FormHeader from 'components/FormHeader';
import Spinner from 'components/Spinner';

import { getWaiversMockData, MOCK_WAIVERS_ENABLED } from '../mockWaiversData';

const ConfirmAndSubmit = () => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const { modelID = '' } = useParams<{ modelID: string }>();

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

  if (loading) {
    return <Spinner size="large" />;
  }

  if (error || !data?.modelPlan?.questionnaires?.waiverAssessmentSurvey) {
    return <NotFoundPartial errorMessage={error?.message} />;
  }

  const selectedWaivers =
    data.modelPlan.questionnaires.waiverAssessmentSurvey.waivers;

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

      {selectedWaivers.length === 0 ? (
        <Alert type="info" slim className="margin-bottom-6">
          {waiverAssessmentSurveyMiscT('modelHasNotSelectedWaiver')}
        </Alert>
      ) : (
        <SelectedWaiversTable selectedWaivers={selectedWaivers} />
      )}
    </div>
  );
};

export default ConfirmAndSubmit;
