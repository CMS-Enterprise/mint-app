import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GetAllOpsEvalAndLearningQuery,
  useGetAllOpsEvalAndLearningQuery
} from 'gql/gen/graphql';

import usePlanTranslation from 'hooks/usePlanTranslation';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlyBody from '../_components/Body';
import ReadOnlySection, {
  RelatedUnneededQuestions
} from '../_components/ReadOnlySection';
import { getRelatedUneededQuestions } from '../_components/ReadOnlySection/util';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyOpsEvalAndLearning = ({
  modelID,
  clearance,
  isViewingFilteredView,
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
    shareCclfData: shareCclfDataRemoved,
    shareCclfDataNote: shareCclfDataNoteRemoved,
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
    useCcwForFileDistribiutionToParticipants: useCcwForFileDistribiutionToParticipantsRemoved,
    useCcwForFileDistribiutionToParticipantsNote: useCcwForFileDistribiutionToParticipantsNoteRemoved,
    developNewQualityMeasures: developNewQualityMeasuresRemoved,
    developNewQualityMeasuresNote: developNewQualityMeasuresNoteRemoved,
    qualityPerformanceImpactsPayment: qualityPerformanceImpactsPaymentRemoved,
    qualityPerformanceImpactsPaymentOther: qualityPerformanceImpactsPaymentOtherRemoved,
    qualityPerformanceImpactsPaymentNote: qualityPerformanceImpactsPaymentNoteRemoved,
    ...opsEvalAndLearningConfigTwo
  } = opsEvalAndLearningConfig;

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
        isViewingFilteredView={isViewingFilteredView}
        status={allOpsEvalAndLearningData.status}
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
            modelName
          })}
        </p>
      )}

      {/* First few sections of Ops data that can be automated */}
      <ReadOnlyBody
        data={allOpsEvalAndLearningData}
        config={opsEvalAndLearningConfigOne}
        filteredView={filteredView}
      />

      {/* CCWAndQuality */}
      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-top-4 padding-top-4 border-top-1px border-base-light'
        }`}
      >
        {!isViewingFilteredView && (
          <h3 className="margin-top-0">
            {opsEvalAndLearningMiscT('ccwSpecificReadonly')}
          </h3>
        )}

        <RelatedUnneededQuestions
          id="quality-questions"
          relatedConditions={getRelatedUneededQuestions(
            opsEvalAndLearningConfig.ccmInvolvment,
            allOpsEvalAndLearningData.ccmInvolvment
          )}
          hideAlert={false}
        />

        <ReadOnlySection
          field="sendFilesBetweenCcw"
          translations={{
            sendFilesBetweenCcw: opsEvalAndLearningConfig.sendFilesBetweenCcw
          }}
          values={allOpsEvalAndLearningData}
          filteredView={filteredView}
        />

        <ReadOnlySection
          field="sendFilesBetweenCcwNote"
          translations={{
            sendFilesBetweenCcwNote:
              opsEvalAndLearningConfig.sendFilesBetweenCcwNote
          }}
          values={allOpsEvalAndLearningData}
          filteredView={filteredView}
        />

        <ReadOnlySection
          field="appToSendFilesToKnown"
          translations={{
            appToSendFilesToKnown:
              opsEvalAndLearningConfig.appToSendFilesToKnown
          }}
          values={allOpsEvalAndLearningData}
          filteredView={filteredView}
        />

        <ReadOnlySection
          field="appToSendFilesToNote"
          translations={{
            appToSendFilesToNote: opsEvalAndLearningConfig.appToSendFilesToNote
          }}
          values={allOpsEvalAndLearningData}
          filteredView={filteredView}
        />

        <ReadOnlySection
          field="useCcwForFileDistribiutionToParticipants"
          translations={{
            useCcwForFileDistribiutionToParticipants:
              opsEvalAndLearningConfig.useCcwForFileDistribiutionToParticipants
          }}
          values={allOpsEvalAndLearningData}
          filteredView={filteredView}
        />

        <ReadOnlySection
          field="useCcwForFileDistribiutionToParticipantsNote"
          translations={{
            useCcwForFileDistribiutionToParticipantsNote:
              opsEvalAndLearningConfig.useCcwForFileDistribiutionToParticipantsNote
          }}
          values={allOpsEvalAndLearningData}
          filteredView={filteredView}
        />
      </div>

      {/* Quality */}
      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-top-4 padding-top-4 border-top-1px border-base-light'
        }`}
      >
        {!isViewingFilteredView && (
          <h3 className="margin-top-0">
            {opsEvalAndLearningMiscT('qualityReadonly')}
          </h3>
        )}

        <RelatedUnneededQuestions
          id="data-needed-for-monitoring-questions"
          relatedConditions={getRelatedUneededQuestions(
            opsEvalAndLearningConfig.dataNeededForMonitoring,
            allOpsEvalAndLearningData.dataNeededForMonitoring
          )}
          hideAlert={false}
        />

        <ReadOnlySection
          field="developNewQualityMeasures"
          translations={{
            developNewQualityMeasures:
              opsEvalAndLearningConfig.developNewQualityMeasures
          }}
          values={allOpsEvalAndLearningData}
          filteredView={filteredView}
        />

        <ReadOnlySection
          field="developNewQualityMeasuresNote"
          translations={{
            developNewQualityMeasuresNote:
              opsEvalAndLearningConfig.developNewQualityMeasuresNote
          }}
          values={allOpsEvalAndLearningData}
          filteredView={filteredView}
        />

        <ReadOnlySection
          field="qualityPerformanceImpactsPayment"
          translations={{
            qualityPerformanceImpactsPayment:
              opsEvalAndLearningConfig.qualityPerformanceImpactsPayment
          }}
          values={allOpsEvalAndLearningData}
          filteredView={filteredView}
        />

        <ReadOnlySection
          field="qualityPerformanceImpactsPaymentNote"
          translations={{
            qualityPerformanceImpactsPaymentNote:
              opsEvalAndLearningConfig.qualityPerformanceImpactsPaymentNote
          }}
          values={allOpsEvalAndLearningData}
          filteredView={filteredView}
        />
      </div>

      {/* Last sections of Ops data that can be automated */}
      <ReadOnlyBody
        data={allOpsEvalAndLearningData}
        config={opsEvalAndLearningConfigTwo}
        filteredView={filteredView}
      />
    </div>
  );
};

export default ReadOnlyOpsEvalAndLearning;
