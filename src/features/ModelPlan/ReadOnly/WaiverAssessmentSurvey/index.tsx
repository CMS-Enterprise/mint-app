import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';
import { useGetAllWaiverAssessmentSurveyQuery } from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import PageLoading from 'components/PageLoading';

import WaiverAssessmentSurveyReadOnlySections from '../../AdditionalQuestionnaires/WaiverAssessmentSurvey/_components/WaiverAssessmentSurveyReadOnlySections';
import SelectedWaiversTable from '../_components/SelectedWaiversTable';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyWaiverAssessmentSurvey = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: waiverAssessmentSurveyMiscT } = useTranslation(
    'waiverAssessmentSurveyMisc'
  );

  const { modelID: modelIDFromParams } = useParams();

  const { data, loading, error } = useGetAllWaiverAssessmentSurveyQuery({
    variables: {
      id: modelID || modelIDFromParams || ''
    }
  });

  if (loading) {
    return <PageLoading />;
  }

  if (error || !data?.modelPlan?.questionnaires?.waiverAssessmentSurvey) {
    return <NotFoundPartial componentNotFound />;
  }

  const allWaiverAssessmentSurveyData =
    data.modelPlan.questionnaires.waiverAssessmentSurvey;

  return (
    <div
      className="read-only-waiver-assessment-survey"
      data-testid="read-only-waiver-assessment-survey"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={waiverAssessmentSurveyMiscT('heading')}
        heading={waiverAssessmentSurveyMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={allWaiverAssessmentSurveyData.status}
        modelID={modelID || modelIDFromParams || ''}
        modifiedOrCreatedDts={
          allWaiverAssessmentSurveyData.modifiedDts ||
          allWaiverAssessmentSurveyData.createdDts
        }
      />
      <h3 className="margin-bottom-2">
        {waiverAssessmentSurveyMiscT('selectedWaivers.heading')}
      </h3>

      {allWaiverAssessmentSurveyData.waivers.length === 0 ? (
        <Alert type="info" slim className="margin-bottom-6">
          {waiverAssessmentSurveyMiscT('modelHasNotSelectedWaiver')}
        </Alert>
      ) : (
        <SelectedWaiversTable
          selectedWaivers={allWaiverAssessmentSurveyData.waivers}
        />
      )}

      <WaiverAssessmentSurveyReadOnlySections modelPlan={data.modelPlan} />
    </div>
  );
};

export default ReadOnlyWaiverAssessmentSurvey;
