import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';

import GettAllOpsEvalAndLearning from 'queries/ReadOnly/GettAllOpsEvalAndLearning';
import { GetAllOpsEvalAndLearning as AllOpsEvalAndLeardningTypes } from 'queries/ReadOnly/types/GetAllOpsEvalAndLearning';
import { DataStartsType } from 'types/graphql-global-types';
import { formatDateUtc } from 'utils/date';
import {
  translateAgencyOrStateHelpType,
  translateBenchmarkForPerformanceType,
  translateBooleanOrNull,
  translateCcmInvolvmentType,
  translateContractorSupportType,
  translateDataForMonitoringType,
  translateDataFrequencyType,
  translateDataFullTimeOrIncrementalType,
  translateDataStartsType,
  translateDataToSendParticipantsType,
  translateEvaluationApproachType,
  translateModelLearningSystemType,
  translateMonitoringFileType,
  translateStakeholdersType
} from 'utils/modelPlan';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import { TaskListStatusTag } from 'views/ModelPlan/TaskList/_components/TaskListItem';
import {
  isCCWInvolvement,
  isQualityMeasures
} from 'views/ModelPlan/TaskList/OpsEvalAndLearning';
import { NotFoundPartial } from 'views/NotFound';

import ReadOnlySection from '../_components/ReadOnlySection';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyOpsEvalAndLearning = ({ modelID, clearance }: ReadOnlyProps) => {
  const { t } = useTranslation('operationsEvaluationAndLearning');
  const { t: h } = useTranslation('draftModelPlan');
  const { t: readOnly } = useTranslation('readOnlyModelPlan');
  const { t: p } = useTranslation('prepareForClearance');

  const { modelName } = useContext(ModelInfoContext);

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
        <h2 className="margin-top-0 margin-bottom-4">
          {clearance
            ? t('operationsEvaluationAndLearningHeading')
            : t('heading')}
        </h2>
        {status && <TaskListStatusTag status={status} />}
      </div>

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {p('forModelPlan', {
            modelName
          })}
        </p>
      )}

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
          copy={translateBooleanOrNull(helpdeskUse)}
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
      {iddocSupport && (
        <>
          <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
            <h3>{readOnly('opsEvalAndLearning.headings.iddoc')}</h3>
            <ReadOnlySection
              heading={t('iddocSupport')}
              copy={translateBooleanOrNull(iddocSupport)}
              notes={iddocSupportNote}
            />
            <div className="desktop:display-flex flex-justify">
              <div
                className={
                  technicalContactsIdentified ? 'desktop:width-card-lg' : ''
                }
              >
                <ReadOnlySection
                  heading={t('technicalContacts')}
                  copy={translateBooleanOrNull(technicalContactsIdentified)}
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
            {/* This is a slight "hack" of this component in order to get around the heading being required */}
            <ReadOnlySection
              heading={h('note')}
              copy={technicalContactsIdentifiedNote}
            />

            <ReadOnlySection
              heading={t('participantInformation')}
              copy={translateBooleanOrNull(captureParticipantInfo)}
              notes={captureParticipantInfoNote}
            />
          </div>

          {/* Interface Control Document - ICD */}
          <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
            <h3>{readOnly('opsEvalAndLearning.headings.icd')}</h3>
            <ReadOnlySection heading={t('icdOwner')} copy={icdOwner} />
            <ReadOnlySection
              heading={t('draftIDC')}
              copy={
                draftIcdDueDate && formatDateUtc(draftIcdDueDate, 'MM/dd/yyyy')
              }
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
                translateMonitoringFileType
              )}
              listOtherItem={dataMonitoringFileOther}
            />
            <ReadOnlySection
              heading={t('responseTypes')}
              copy={dataResponseType}
            />
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
                  copy={translateBooleanOrNull(eftSetUp)}
                />
              </div>
            </div>
            <div className="desktop:display-flex flex-justify">
              <div className="desktop:width-card-lg">
                <ReadOnlySection
                  heading={t('adjustments')}
                  copy={translateBooleanOrNull(unsolicitedAdjustmentsIncluded)}
                />
              </div>
              <div className="desktop:width-card-lg">
                <ReadOnlySection
                  heading={t('diagrams')}
                  copy={translateBooleanOrNull(dataFlowDiagramsNeeded)}
                />
              </div>
            </div>
            <ReadOnlySection
              heading={t('benefitEnhancement')}
              copy={translateBooleanOrNull(produceBenefitEnhancementFiles)}
            />
            <ReadOnlySection
              heading={t('namingConventions')}
              copy={fileNamingConventions}
              notes={dataMonitoringNote}
            />
          </div>
        </>
      )}

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
          copy={translateBooleanOrNull(computePerformanceScores)}
          notes={computePerformanceScoresNote}
        />

        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.riskAdj.performanceScores')}
              copy={translateBooleanOrNull(riskAdjustPerformance)}
            />
          </div>
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.riskAdj.feedbackResults')}
              copy={translateBooleanOrNull(riskAdjustFeedback)}
            />
          </div>
        </div>
        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.riskAdj.payments')}
              copy={translateBooleanOrNull(riskAdjustPayments)}
            />
          </div>
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.riskAdj.others')}
              copy={translateBooleanOrNull(riskAdjustOther)}
            />
          </div>
        </div>
        {/* This is a slight "hack" of this component in order to get around the heading being required */}
        <ReadOnlySection heading={h('note')} copy={riskAdjustNote} />

        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.appeal.performanceScores')}
              copy={translateBooleanOrNull(appealPerformance)}
            />
          </div>
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.appeal.feedbackResults')}
              copy={translateBooleanOrNull(appealFeedback)}
            />
          </div>
        </div>

        <div className="desktop:display-flex flex-justify">
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.appeal.payments')}
              copy={translateBooleanOrNull(appealPayments)}
            />
          </div>
          <div className="desktop:width-card-lg">
            <ReadOnlySection
              heading={readOnly('opsEvalAndLearning.appeal.others')}
              copy={translateBooleanOrNull(appealOther)}
            />
          </div>
        </div>
        {/* This is a slight "hack" of this component in order to get around the heading being required */}
        <ReadOnlySection heading={h('note')} copy={appealNote} />
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
          listOtherItem={dataToSendParticicipantsOther}
          notes={dataToSendParticicipantsNote}
        />
        <ReadOnlySection
          heading={t('claimLineFeed')}
          copy={translateBooleanOrNull(shareCclfData)}
          notes={shareCclfDataNote}
        />
      </div>

      {/* CCWAndQuality */}
      {isCCWInvolvement(ccmInvolvment) && (
        <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
          <h3>{readOnly('opsEvalAndLearning.headings.ccw')}</h3>
          <ReadOnlySection
            heading={t('ccwSendFiles')}
            copy={translateBooleanOrNull(sendFilesBetweenCcw)}
            notes={sendFilesBetweenCcwNote}
          />
          <div className="desktop:display-flex flex-justify">
            <div
              className={appToSendFilesToKnown ? 'desktop:width-card-lg' : ''}
            >
              <ReadOnlySection
                heading={t('fileTransfers')}
                copy={translateBooleanOrNull(appToSendFilesToKnown)}
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
          {/* This is a slight "hack" of this component in order to get around the heading being required */}
          <ReadOnlySection heading={h('note')} copy={appToSendFilesToNote} />

          <ReadOnlySection
            heading={t('distributeFiles')}
            copy={translateBooleanOrNull(
              useCcwForFileDistribiutionToParticipants
            )}
            notes={useCcwForFileDistribiutionToParticipantsNote}
          />
        </div>
      )}

      {/* Quality */}
      {isQualityMeasures(dataNeededForMonitoring) && (
        <div className="margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light">
          <h3>{readOnly('opsEvalAndLearning.headings.quality')}</h3>
          <ReadOnlySection
            heading={t('validatedQuality')}
            copy={translateBooleanOrNull(developNewQualityMeasures)}
            notes={developNewQualityMeasuresNote}
          />
          <ReadOnlySection
            heading={t('impactPayment')}
            copy={translateBooleanOrNull(qualityPerformanceImpactsPayment)}
            notes={qualityPerformanceImpactsPaymentNote}
          />
        </div>
      )}

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
