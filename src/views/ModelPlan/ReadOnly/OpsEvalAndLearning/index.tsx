import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetAllOpsEvalAndLearningQuery,
  useGetAllOpsEvalAndLearningQuery
} from 'gql/gen/graphql';

import PageLoading from 'components/PageLoading';
import usePlanTranslation from 'hooks/usePlanTranslation';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlyBody from '../_components/Body';
import { RelatedUnneededQuestions } from '../_components/ReadOnlySection';
import { getFilterGroupInfo } from '../_components/ReadOnlySection/util';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyOpsEvalAndLearning = ({
  modelID,
  clearance,
  filteredView
}: ReadOnlyProps) => {
  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );

  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const opsEvalAndLearningConfig = usePlanTranslation('opsEvalAndLearning');

  const { modelName } = useContext(ModelInfoContext);

  const { data, loading, error } = useGetAllOpsEvalAndLearningQuery({
    variables: {
      id: modelID
    }
  });

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const allOpsEvalAndLearningData = (data?.modelPlan.opsEvalAndLearning ||
    {}) as GetAllOpsEvalAndLearningQuery['modelPlan']['opsEvalAndLearning'];

  const {
    sendFilesBetweenCcw: sendFilesBetweenCcwRemoved,
    sendFilesBetweenCcwNote: sendFilesBetweenCcwNoteRemoved,
    appToSendFilesToKnown: appToSendFilesToKnownRemoved,
    appToSendFilesToWhich,
    appToSendFilesToNote,
    useCcwForFileDistribiutionToParticipants,
    useCcwForFileDistribiutionToParticipantsNote,
    developNewQualityMeasures,
    developNewQualityMeasuresNote,
    qualityPerformanceImpactsPayment,
    qualityPerformanceImpactsPaymentOther,
    qualityPerformanceImpactsPaymentNote,
    dataSharingStarts,
    dataSharingStartsOther,
    dataSharingFrequency,
    dataSharingStartsNote,
    dataCollectionStarts,
    dataCollectionStartsOther,
    dataCollectionFrequency,
    dataCollectionFrequencyNote,
    qualityReportingStarts,
    qualityReportingStartsOther,
    qualityReportingStartsNote,
    qualityReportingFrequency,
    modelLearningSystems,
    modelLearningSystemsOther,
    modelLearningSystemsNote,
    anticipatedChallenges,
    ...opsEvalAndLearningConfigOne
  } = opsEvalAndLearningConfig;

  const ccwConfig = {
    sendFilesBetweenCcw: opsEvalAndLearningConfig.sendFilesBetweenCcw,
    sendFilesBetweenCcwNote: opsEvalAndLearningConfig.sendFilesBetweenCcwNote,
    appToSendFilesToKnown: opsEvalAndLearningConfig.appToSendFilesToKnown,
    appToSendFilesToWhich: opsEvalAndLearningConfig.appToSendFilesToWhich,
    appToSendFilesToNote: opsEvalAndLearningConfig.appToSendFilesToNote,
    useCcwForFileDistribiutionToParticipants:
      opsEvalAndLearningConfig.useCcwForFileDistribiutionToParticipants,
    useCcwForFileDistribiutionToParticipantsNote:
      opsEvalAndLearningConfig.useCcwForFileDistribiutionToParticipantsNote
  };

  const qualityConfig = {
    developNewQualityMeasures:
      opsEvalAndLearningConfig.developNewQualityMeasures,
    developNewQualityMeasuresNote:
      opsEvalAndLearningConfig.developNewQualityMeasuresNote,
    qualityPerformanceImpactsPayment:
      opsEvalAndLearningConfig.qualityPerformanceImpactsPayment,
    qualityPerformanceImpactsPaymentOther:
      opsEvalAndLearningConfig.qualityPerformanceImpactsPaymentOther,
    qualityPerformanceImpactsPaymentNote:
      opsEvalAndLearningConfig.qualityPerformanceImpactsPaymentNote
  };

  const {
    stakeholders,
    stakeholdersOther,
    stakeholdersNote,
    helpdeskUse,
    helpdeskUseNote,
    contractorSupport,
    contractorSupportOther,
    contractorSupportHow,
    contractorSupportNote,
    iddocSupport,
    iddocSupportNote,
    technicalContactsIdentified,
    technicalContactsIdentifiedDetail,
    technicalContactsIdentifiedNote,
    captureParticipantInfo,
    captureParticipantInfoNote,
    icdOwner,
    draftIcdDueDate,
    icdNote,
    uatNeeds,
    stcNeeds,
    testingTimelines,
    testingNote,
    dataMonitoringFileTypes,
    dataMonitoringFileOther,
    dataResponseType,
    dataResponseFileFrequency,
    dataFullTimeOrIncremental,
    eftSetUp,
    unsolicitedAdjustmentsIncluded,
    dataFlowDiagramsNeeded,
    produceBenefitEnhancementFiles,
    fileNamingConventions,
    dataMonitoringNote,
    benchmarkForPerformance,
    benchmarkForPerformanceNote,
    computePerformanceScores,
    computePerformanceScoresNote,
    riskAdjustPerformance,
    riskAdjustFeedback,
    riskAdjustPayments,
    riskAdjustOther,
    riskAdjustNote,
    appealPerformance,
    appealFeedback,
    appealPayments,
    appealOther,
    appealNote,
    evaluationApproaches,
    evaluationApproachOther,
    evalutaionApproachNote,
    ccmInvolvment,
    ccmInvolvmentOther,
    ccmInvolvmentNote,
    dataNeededForMonitoring,
    dataNeededForMonitoringOther,
    dataNeededForMonitoringNote,
    dataToSendParticicipants,
    dataToSendParticicipantsOther,
    dataToSendParticicipantsNote,
    shareCclfData,
    shareCclfDataNote,
    sendFilesBetweenCcw,
    sendFilesBetweenCcwNote,
    appToSendFilesToKnown,
    useCcwForFileDistribiutionToParticipants:
      useCcwForFileDistribiutionToParticipantsRemoved,
    useCcwForFileDistribiutionToParticipantsNote:
      useCcwForFileDistribiutionToParticipantsNoteRemoved,
    developNewQualityMeasures: developNewQualityMeasuresRemoved,
    developNewQualityMeasuresNote: developNewQualityMeasuresNoteRemoved,
    qualityPerformanceImpactsPayment: qualityPerformanceImpactsPaymentRemoved,
    qualityPerformanceImpactsPaymentOther:
      qualityPerformanceImpactsPaymentOtherRemoved,
    qualityPerformanceImpactsPaymentNote:
      qualityPerformanceImpactsPaymentNoteRemoved,
    ...opsEvalAndLearningConfigTwo
  } = opsEvalAndLearningConfig;

  const claimsFilterGroupFields = getFilterGroupInfo(ccwConfig, filteredView);

  const qualityFilterGroupFields = getFilterGroupInfo(
    qualityConfig,
    filteredView
  );

  const renderContent = () => {
    if (!filteredView) {
      return (
        <>
          {/* First few sections of Ops data that can be automated */}
          <ReadOnlyBody
            data={allOpsEvalAndLearningData}
            config={opsEvalAndLearningConfigOne}
            filteredView={filteredView}
          />

          {/* CCWAndQuality */}
          <div
            className={`${
              filteredView
                ? ''
                : 'margin-top-4 padding-top-4 border-top-1px border-base-light'
            }`}
          >
            {!filteredView && (
              <h3 className="margin-top-0">
                {opsEvalAndLearningMiscT('ccwSpecificReadonly')}
              </h3>
            )}

            <RelatedUnneededQuestions
              id="quality-questions"
              config={opsEvalAndLearningConfig.ccmInvolvment}
              value={allOpsEvalAndLearningData.ccmInvolvment}
              childrenToCheck={
                filteredView ? claimsFilterGroupFields : undefined
              }
            />

            <ReadOnlyBody
              data={allOpsEvalAndLearningData}
              config={ccwConfig}
              filteredView={filteredView}
            />
          </div>

          {/* Quality */}
          <div
            className={`${
              filteredView
                ? ''
                : 'margin-top-4 padding-top-4 border-top-1px border-base-light'
            }`}
          >
            {!filteredView && (
              <h3 className="margin-top-0">
                {opsEvalAndLearningMiscT('qualityReadonly')}
              </h3>
            )}

            <RelatedUnneededQuestions
              id="data-needed-for-monitoring-questions"
              config={opsEvalAndLearningConfig.dataNeededForMonitoring}
              value={allOpsEvalAndLearningData.dataNeededForMonitoring}
              childrenToCheck={
                filteredView ? qualityFilterGroupFields : undefined
              }
            />

            <ReadOnlyBody
              data={allOpsEvalAndLearningData}
              config={qualityConfig}
              filteredView={filteredView}
            />
          </div>

          {/* Last sections of Ops data that can be automated */}
          <ReadOnlyBody
            data={allOpsEvalAndLearningData}
            config={opsEvalAndLearningConfigTwo}
            filteredView={filteredView}
          />
        </>
      );
    }
    return (
      <ReadOnlyBody
        data={allOpsEvalAndLearningData}
        config={opsEvalAndLearningConfig}
        filteredView={filteredView}
      />
    );
  };

  return (
    <div
      className="read-only-model-plan--ops-eval-and-learning"
      data-testid="read-only-model-plan--ops-eval-and-learning"
    >
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={opsEvalAndLearningMiscT(
          'operationsEvaluationAndLearningHeading'
        )}
        heading={opsEvalAndLearningMiscT('heading')}
        isViewingFilteredView={!!filteredView}
        status={allOpsEvalAndLearningData.status}
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
            modelName
          })}
        </p>
      )}

      {loading && !data ? (
        <div className="height-viewport">
          <PageLoading />
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default ReadOnlyOpsEvalAndLearning;
