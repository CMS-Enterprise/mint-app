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
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyOpsEvalAndLearning = ({
  modelID,
  clearance,
  isViewingFilteredView
}: ReadOnlyProps) => {
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
        {!isViewingFilteredView && status && (
          <TaskListStatusTag status={status} />
        )}
      </div>

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {p('forModelPlan', {
            modelName
          })}
        </p>
      )}

      {/* // OpsEvalAndLearningContent */}
      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
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

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        <h3>{readOnly('opsEvalAndLearning.headings.iddoc')}</h3>
        <ReadOnlySection
          heading={t('iddocSupport')}
          copy={translateBooleanOrNull(iddocSupport)}
          notes={iddocSupportNote}
        />
        {iddocSupport && (
          <SideBySideReadOnlySection
            firstSection={{
              heading: t('technicalContacts'),
              copy: translateBooleanOrNull(technicalContactsIdentified)
            }}
            secondSection={
              technicalContactsIdentified === true && {
                heading: h('pleaseSpecify'),
                copy: technicalContactsIdentifiedDetail
              }
            }
          />
        )}

        {/* This is a slight "hack" of this component in order to get around the heading being required */}

        {iddocSupport && (
          <>
            <ReadOnlySection
              heading={h('note')}
              copy={technicalContactsIdentifiedNote}
            />

            <ReadOnlySection
              heading={t('participantInformation')}
              copy={translateBooleanOrNull(captureParticipantInfo)}
              notes={captureParticipantInfoNote}
            />
          </>
        )}
      </div>

      {/* Interface Control Document - ICD */}
      {iddocSupport && (
        <>
          <div
            className={`${
              isViewingFilteredView
                ? ''
                : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
            }`}
          >
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
          <div
            className={`${
              isViewingFilteredView
                ? ''
                : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
            }`}
          >
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
          <div
            className={`${
              isViewingFilteredView
                ? ''
                : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
            }`}
          >
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

            <SideBySideReadOnlySection
              firstSection={{
                heading: t('timeFrequency'),
                copy:
                  dataFullTimeOrIncremental &&
                  translateDataFullTimeOrIncrementalType(
                    dataFullTimeOrIncremental
                  )
              }}
              secondSection={{
                heading: t('eftAndConnectivity'),
                copy: translateBooleanOrNull(eftSetUp)
              }}
            />

            <SideBySideReadOnlySection
              firstSection={{
                heading: t('adjustments'),
                copy: translateBooleanOrNull(unsolicitedAdjustmentsIncluded)
              }}
              secondSection={{
                heading: t('diagrams'),
                copy: translateBooleanOrNull(dataFlowDiagramsNeeded)
              }}
            />

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
      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
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

        <SideBySideReadOnlySection
          firstSection={{
            heading: readOnly('opsEvalAndLearning.riskAdj.performanceScores'),
            copy: translateBooleanOrNull(riskAdjustPerformance)
          }}
          secondSection={{
            heading: readOnly('opsEvalAndLearning.riskAdj.feedbackResults'),
            copy: translateBooleanOrNull(riskAdjustFeedback)
          }}
        />

        <SideBySideReadOnlySection
          firstSection={{
            heading: readOnly('opsEvalAndLearning.riskAdj.payments'),
            copy: translateBooleanOrNull(riskAdjustPayments)
          }}
          secondSection={{
            heading: readOnly('opsEvalAndLearning.riskAdj.others'),
            copy: translateBooleanOrNull(riskAdjustOther)
          }}
        />

        {/* This is a slight "hack" of this component in order to get around the heading being required */}
        <ReadOnlySection heading={h('note')} copy={riskAdjustNote} />

        <SideBySideReadOnlySection
          firstSection={{
            heading: readOnly('opsEvalAndLearning.appeal.performanceScores'),
            copy: translateBooleanOrNull(appealPerformance)
          }}
          secondSection={{
            heading: readOnly('opsEvalAndLearning.appeal.feedbackResults'),
            copy: translateBooleanOrNull(appealFeedback)
          }}
        />

        <SideBySideReadOnlySection
          firstSection={{
            heading: readOnly('opsEvalAndLearning.appeal.payments'),
            copy: translateBooleanOrNull(appealPayments)
          }}
          secondSection={{
            heading: readOnly('opsEvalAndLearning.appeal.others'),
            copy: translateBooleanOrNull(appealOther)
          }}
        />

        {/* This is a slight "hack" of this component in order to get around the heading being required */}
        <ReadOnlySection heading={h('note')} copy={appealNote} />
      </div>

      {/* Evaluation */}
      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
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
        <div
          className={`${
            isViewingFilteredView
              ? ''
              : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
          }`}
        >
          <h3>{readOnly('opsEvalAndLearning.headings.ccw')}</h3>
          <ReadOnlySection
            heading={t('ccwSendFiles')}
            copy={translateBooleanOrNull(sendFilesBetweenCcw)}
            notes={sendFilesBetweenCcwNote}
          />
          <SideBySideReadOnlySection
            firstSection={{
              heading: t('fileTransfers'),
              copy: translateBooleanOrNull(appToSendFilesToKnown)
            }}
            secondSection={
              appToSendFilesToKnown === true && {
                heading: h('pleaseSpecify'),
                copy: appToSendFilesToWhich
              }
            }
          />

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
        <div
          className={`${
            isViewingFilteredView
              ? ''
              : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
          }`}
        >
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
      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
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
      <div>
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
