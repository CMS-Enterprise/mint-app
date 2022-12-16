import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GettAllOpsEvalAndLearning from 'queries/ReadOnly/GettAllOpsEvalAndLearning';
import { GetAllOpsEvalAndLearning as AllOpsEvalAndLeardningTypes } from 'queries/ReadOnly/types/GetAllOpsEvalAndLearning';
import { DataStartsType } from 'types/graphql-global-types';
import { formatDate } from 'utils/date';
import {
  translateAgencyOrStateHelpType,
  translateBenchmarkForPerformanceType,
  translateCcmInvolvmentType,
  translateContractorSupportType,
  translateDataForMonitoringType,
  translateDataFrequencyType,
  translateDataFullTimeOrIncrementalType,
  translateDataStartsType,
  translateDataToSendParticipantsType,
  translateEvaluationApproachType,
  translateModelLearningSystemType,
  translateStakeholdersType
} from 'utils/modelPlan';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';

const ReadOnlyOpsEvalAndLearning = ({ modelID }: { modelID: string }) => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { t: readOnly } = useTranslation('readOnlyModelPlan');

  const { data, loading, error } = useQuery<AllOpsEvalAndLeardningTypes>(
    GettAllOpsEvalAndLearning,
    {
      variables: {
        id: modelID
      }
    }
  );

  if ((!loading && error) || (!loading && !data?.modelPlan)) {
    return <NotFoundPartial />;
  }

  const {
    // OpsEvalAndLearningContent
    agencyOrStateHelp,
    agencyOrStateHelpOther,
    agencyOrStateHelpNote,
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
    // IDDOC
    technicalContactsIdentified,
    technicalContactsIdentifiedDetail,
    technicalContactsIdentifiedNote,
    captureParticipantInfo,
    captureParticipantInfoNote,
    icdOwner,
    draftIcdDueDate,
    icdNote,
    // IDDOCTesting
    uatNeeds,
    stcNeeds,
    testingTimelines,
    testingNote,
    dataMonitoringFileTypes,
    dataMonitoringFileOther,
    dataResponseType,
    dataResponseFileFrequency,
    // IDDOCMonitoring
    dataFullTimeOrIncremental,
    eftSetUp,
    unsolicitedAdjustmentsIncluded,
    dataFlowDiagramsNeeded,
    produceBenefitEnhancementFiles,
    fileNamingConventions,
    dataMonitoringNote,
    // Performance
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
    // Evaluation
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
    // CCW and Quality
    sendFilesBetweenCcw,
    sendFilesBetweenCcwNote,
    appToSendFilesToKnown,
    appToSendFilesToWhich,
    appToSendFilesToNote,
    useCcwForFileDistribiutionToParticipants,
    useCcwForFileDistribiutionToParticipantsNote,
    developNewQualityMeasures,
    developNewQualityMeasuresNote,
    qualityPerformanceImpactsPayment,
    qualityPerformanceImpactsPaymentNote,
    // Data Sharing
    dataSharingStarts,
    dataSharingStartsOther,
    dataSharingFrequency,
    dataSharingFrequencyOther,
    dataSharingStartsNote,
    dataCollectionStarts,
    dataCollectionStartsOther,
    dataCollectionFrequency,
    dataCollectionFrequencyOther,
    dataCollectionFrequencyNote,
    qualityReportingStarts,
    qualityReportingStartsOther,
    qualityReportingStartsNote,
    // Learning
    modelLearningSystems,
    modelLearningSystemsOther,
    modelLearningSystemsNote,
    anticipatedChallenges,
    status
  } = data?.modelPlan.opsEvalAndLearning || {};

  return (
    <div
      className="read-only-model-plan--ops-eval-and-learning"
      data-testid="read-only-model-plan--ops-eval-and-learning"
    >
      <div className="display-flex flex-justify flex-align-start">
        <h2 className="margin-top-0 margin-bottom-4 flex-2">{t('heading')}</h2>
        {status && <TaskListStatusTag status={status} />}
      </div>

      {/* // OpsEvalAndLearningContent */}
      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={readOnly('opsEvalAndLearning.anotherAgency')}
          list
          listItems={agencyOrStateHelp?.map(translateAgencyOrStateHelpType)}
          listOtherItem={agencyOrStateHelpOther}
          notes={agencyOrStateHelpNote}
        />
        <ReadOnlySection
          heading={t('stakeholders')}
          list
          listItems={stakeholders?.map(translateStakeholdersType)}
          listOtherItem={stakeholdersOther}
          notes={stakeholdersNote}
        />
        <ReadOnlySection
          heading={t('helpDesk')}
          copy={helpdeskUse ? h('yes') : h('no')}
          notes={helpdeskUseNote}
        />
        <ReadOnlySection
          heading={t('whatContractors')}
          list
          listItems={contractorSupport?.map(translateContractorSupportType)}
          listOtherItem={contractorSupportOther}
          notes={contractorSupportNote}
        />
        <ReadOnlySection
          heading={t('whatContractorsHow')}
          copy={contractorSupportHow}
        />
      </div>

      {/* IDDOC */}
      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <h3>{readOnly('opsEvalAndLearning.headings.iddoc')}</h3>
        <ReadOnlySection
          heading={t('iddocSupport')}
          copy={iddocSupport ? h('yes') : h('no')}
          notes={iddocSupportNote}
        />
        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('technicalContacts')}
              copy={technicalContactsIdentified ? h('yes') : h('no')}
              notes={technicalContactsIdentifiedNote} // TODO: fix this
            />
          </div>
          {/* Only display specification div if "yes" was selected for technical contacts question above */}
          {technicalContactsIdentified && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={h('pleaseSpecify')}
                copy={technicalContactsIdentifiedDetail}
              />
            </div>
          )}
        </div>
        <ReadOnlySection
          heading={t('participantInformation')}
          copy={captureParticipantInfo ? h('yes') : h('no')}
          notes={captureParticipantInfoNote}
        />
      </div>

      {/* Interface Control Document - ICD */}
      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <h3>{readOnly('opsEvalAndLearning.headings.icd')}</h3>
        <ReadOnlySection heading={t('icdOwner')} copy={icdOwner} />
        <ReadOnlySection
          heading={t('draftIDC')}
          copy={draftIcdDueDate && formatDate(draftIcdDueDate, 'MM/dd/yyyy')}
          notes={icdNote}
        />
      </div>

      {/* IDDOCTesting */}
      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <h3>{readOnly('opsEvalAndLearning.headings.testing')}</h3>
        <ReadOnlySection heading={t('uatNeeds')} copy={uatNeeds} />
        <ReadOnlySection heading={t('stcNeeds')} copy={stcNeeds} />
        <ReadOnlySection
          heading={t('testingTimelines')}
          copy={testingTimelines}
          notes={testingNote}
        />
      </div>

      {/* IDDOCMonitoring */}
      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <h3>{readOnly('opsEvalAndLearning.headings.dataMonitoring')}</h3>
        <ReadOnlySection
          heading={t('fileTypes')}
          list
          listItems={dataMonitoringFileTypes?.map(
            // TODO: this is showing blanks instead of translation, fix
            translateDataForMonitoringType
          )}
          listOtherItem={dataMonitoringFileOther}
        />
        <ReadOnlySection heading={t('responseTypes')} copy={dataResponseType} />
        <ReadOnlySection
          heading={t('fileFrequency')}
          copy={dataResponseFileFrequency}
        />
        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('timeFrequency')}
              copy={
                dataFullTimeOrIncremental &&
                translateDataFullTimeOrIncrementalType(
                  dataFullTimeOrIncremental
                )
              }
            />
          </div>
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('eftAndConnectivity')}
              copy={eftSetUp ? h('yes') : h('no')}
            />
          </div>
        </div>
        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('adjustments')}
              copy={unsolicitedAdjustmentsIncluded ? h('yes') : h('no')}
            />
          </div>
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('diagrams')}
              copy={dataFlowDiagramsNeeded ? h('yes') : h('no')}
            />
          </div>
        </div>
        <ReadOnlySection
          heading={t('benefitEnhancement')}
          copy={produceBenefitEnhancementFiles ? h('yes') : h('no')}
        />
        <ReadOnlySection
          heading={t('namingConventions')}
          copy={fileNamingConventions}
          notes={dataMonitoringNote}
        />
      </div>

      {/* Performance */}
      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={t('establishBenchmark')}
          copy={
            benchmarkForPerformance &&
            translateBenchmarkForPerformanceType(benchmarkForPerformance)
          }
          notes={benchmarkForPerformanceNote}
        />
        <ReadOnlySection
          heading={t('computeScores')}
          copy={computePerformanceScores ? h('yes') : h('no')}
          notes={computePerformanceScoresNote}
        />

        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.riskAdj.performanceScores')}
              copy={riskAdjustPerformance ? h('yes') : h('no')}
            />
          </div>
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.riskAdj.feedbackResults')}
              copy={riskAdjustFeedback ? h('yes') : h('no')}
            />
          </div>
        </div>
        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.riskAdj.payments')}
              copy={riskAdjustPayments ? h('yes') : h('no')}
              notes={riskAdjustNote} // TODO: fix this
            />
          </div>
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.riskAdj.others')}
              copy={riskAdjustOther ? h('yes') : h('no')}
            />
          </div>
        </div>

        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.appeal.performanceScores')}
              copy={appealPerformance ? h('yes') : h('no')}
            />
          </div>
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.appeal.feedbackResults')}
              copy={appealFeedback ? h('yes') : h('no')}
            />
          </div>
        </div>

        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.appeal.payments')}
              copy={appealPayments ? h('yes') : h('no')}
              notes={appealNote} // TODO: fix this
            />
          </div>
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.appeal.others')}
              copy={appealOther ? h('yes') : h('no')}
            />
          </div>
        </div>
        {/* TODO: <ReadOnlySection heading="Notes" notes={appealNote} /> */}
      </div>

      {/* Evaluation */}
      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <ReadOnlySection
          heading={readOnly('opsEvalAndLearning.evaluationApproach')}
          list
          listItems={evaluationApproaches?.map(translateEvaluationApproachType)}
          listOtherItem={evaluationApproachOther}
          notes={evalutaionApproachNote}
        />
        <ReadOnlySection
          heading={t('ccw')}
          list
          listItems={ccmInvolvment?.map(translateCcmInvolvmentType)}
          listOtherItem={ccmInvolvmentOther}
          notes={ccmInvolvmentNote}
        />
        <ReadOnlySection
          heading={readOnly('opsEvalAndLearning.dataNeeded')}
          list
          listItems={dataNeededForMonitoring?.map(
            translateDataForMonitoringType
          )}
          listOtherItem={dataNeededForMonitoringOther}
          notes={dataNeededForMonitoringNote}
        />
        <ReadOnlySection
          heading={readOnly('opsEvalAndLearning.dataToSend')}
          list
          listItems={dataToSendParticicipants?.map(
            translateDataToSendParticipantsType
          )}
          listOtherItem={dataToSendParticicipantsOther} // TODO: this doesnt display, fix
          notes={dataToSendParticicipantsNote}
        />
        <ReadOnlySection
          heading={t('claimLineFeed')}
          copy={shareCclfData ? h('yes') : h('no')}
          notes={shareCclfDataNote}
        />
      </div>

      {/* CCWAndQuality */}
      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <h3>{readOnly('opsEvalAndLearning.headings.ccw')}</h3>
        <ReadOnlySection
          heading={t('ccwSendFiles')}
          copy={sendFilesBetweenCcw ? h('yes') : h('no')}
          notes={sendFilesBetweenCcwNote}
        />
        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={t('fileTransfers')}
              copy={appToSendFilesToKnown ? h('yes') : h('no')}
              notes={appToSendFilesToNote} // TODO: fix this
            />
          </div>
          {/* Only display specification div if "yes" was selected for file transfer question above */}
          {appToSendFilesToKnown && (
            <div className="desktop:width-card-lg">
              <ReadOnlySection
                heading={h('pleaseSpecify')}
                copy={appToSendFilesToWhich}
              />
            </div>
          )}
        </div>

        <ReadOnlySection
          heading={t('distributeFiles')}
          copy={useCcwForFileDistribiutionToParticipants ? h('yes') : h('no')}
          notes={useCcwForFileDistribiutionToParticipantsNote}
        />
      </div>

      {/* Quality */}
      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <h3>{readOnly('opsEvalAndLearning.headings.quality')}</h3>
        <ReadOnlySection
          heading={t('validatedQuality')}
          copy={developNewQualityMeasures ? h('yes') : h('no')}
          notes={developNewQualityMeasuresNote}
        />
        <ReadOnlySection
          heading={t('impactPayment')}
          copy={qualityPerformanceImpactsPayment ? h('yes') : h('no')}
          notes={qualityPerformanceImpactsPaymentNote}
        />
      </div>

      {/* DataSharing */}
      <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
        <h3>{readOnly('opsEvalAndLearning.headings.data')}</h3>
        <ReadOnlySection
          heading={t('dataSharing')}
          copy={
            dataSharingStarts &&
            (dataSharingStarts === DataStartsType.OTHER
              ? `${translateDataStartsType(
                  dataSharingStarts
                )} \u2014  ${dataSharingStartsOther}`
              : translateDataStartsType(dataSharingStarts))
          }
        />
        <ReadOnlySection
          heading={t('dataSharingHowOften')}
          list
          listItems={dataSharingFrequency?.map(translateDataFrequencyType)}
          listOtherItem={dataSharingFrequencyOther}
          notes={dataSharingStartsNote}
        />
        <ReadOnlySection
          heading={t('dataCollection')}
          copy={
            dataCollectionStarts &&
            (dataCollectionStarts === DataStartsType.OTHER
              ? `${translateDataStartsType(
                  dataCollectionStarts
                )} \u2014  ${dataCollectionStartsOther}`
              : translateDataStartsType(dataCollectionStarts))
          }
        />
        <ReadOnlySection
          heading={t('dataCollectionHowOften')}
          list
          listItems={dataCollectionFrequency?.map(translateDataFrequencyType)}
          listOtherItem={dataCollectionFrequencyOther}
          notes={dataCollectionFrequencyNote}
        />
        <ReadOnlySection
          heading={t('dataReporting')}
          copy={
            qualityReportingStarts &&
            (qualityReportingStarts === DataStartsType.OTHER
              ? `${translateDataStartsType(
                  qualityReportingStarts
                )} \u2014  ${qualityReportingStartsOther}`
              : translateDataStartsType(qualityReportingStarts))
          }
          notes={qualityReportingStartsNote}
        />
      </div>

      {/* Learning */}
      <div className="margin-bottom-4 padding-bottom-2">
        <ReadOnlySection
          heading={t('learningSystem')}
          list
          listItems={modelLearningSystems?.map(
            translateModelLearningSystemType
          )}
          listOtherItem={modelLearningSystemsOther}
          notes={modelLearningSystemsNote}
        />
        <ReadOnlySection
          heading={t('obstacles')}
          copy={anticipatedChallenges}
        />
      </div>
    </div>
  );
};

export default ReadOnlyOpsEvalAndLearning;
