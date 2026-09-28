import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { NotFoundPartial } from 'features/NotFound';
import { useGetAllWaiverAssessmentSurveyQuery } from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import PageLoading from 'components/PageLoading';
import { sortByName } from 'utils/formUtil';

import WaiverQuestionsReadOnlySections from '../../AdditionalQuestionnaires/WaiverAssessmentSurvey/_components/WaiverQuestionsReadOnlySections';
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

  const waiverSelectionData = data.modelPlan.waiverInfo.commonWaivers;

  const selectedWaivers = waiverSelectionData
    .filter(waiver => waiver.willUseWaiver === true)
    .sort(sortByName);

  const declinedWaivers = waiverSelectionData
    .filter(waiver => waiver.isSuggested && waiver.willUseWaiver === false)
    .sort(sortByName);

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
      {/* Selected waivers section */}
      <div>
        <h3 className="margin-bottom-2">
          {waiverAssessmentSurveyMiscT('selectedWaivers.heading', {
            waiverCount: selectedWaivers.length
          })}
        </h3>

        {selectedWaivers.length === 0 ? (
          <Alert type="info" slim className="margin-bottom-6">
            {waiverAssessmentSurveyMiscT('selectedWaivers.emptyAlert')}
          </Alert>
        ) : (
          <SelectedWaiversTable
            selectedWaivers={selectedWaivers}
            visibleColumns={['waiverName', 'actions']}
          />
        )}
      </div>

      {/* Declined waivers section */}
      <div>
        <h3 className="margin-bottom-05">
          {waiverAssessmentSurveyMiscT('declinedWaivers.heading', {
            waiverCount: declinedWaivers.length
          })}
        </h3>

        <div className="margin-bottom-5">
          {declinedWaivers.length === 0 ? (
            <Alert type="info" slim>
              {waiverAssessmentSurveyMiscT('declinedWaivers.emptyAlert')}
            </Alert>
          ) : (
            <SelectedWaiversTable selectedWaivers={declinedWaivers} />
          )}
        </div>
      </div>

      <WaiverQuestionsReadOnlySections modelPlan={data.modelPlan} isReadview />
    </div>
  );
};

export default ReadOnlyWaiverAssessmentSurvey;
