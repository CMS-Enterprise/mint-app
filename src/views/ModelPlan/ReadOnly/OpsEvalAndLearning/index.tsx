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
import {
  isCCWInvolvement,
  isQualityMeasures
} from 'views/ModelPlan/TaskList/OpsEvalAndLearning';
import { NotFoundPartial } from 'views/NotFound';

import { checkGroupMap } from '../_components/FilterView/util';
import ReadOnlySection from '../_components/ReadOnlySection';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyOpsEvalAndLearning = ({
  modelID,
  clearance,
  isViewingFilteredView,
  filteredQuestions
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
      <TitleAndStatus
        clearance={clearance}
        clearanceTitle={t('operationsEvaluationAndLearningHeading')}
        heading={t('heading')}
        isViewingFilteredView={isViewingFilteredView}
        status={status}
      />

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
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'agencyOrStateHelp',
          <ReadOnlySection
            heading={readOnly('opsEvalAndLearning.anotherAgency')}
            list
            listItems={agencyOrStateHelp?.map(translateAgencyOrStateHelpType)}
            listOtherItem={agencyOrStateHelpOther}
            notes={agencyOrStateHelpNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'stakeholders',
          <ReadOnlySection
            heading={t('stakeholders')}
            list
            listItems={stakeholders?.map(translateStakeholdersType)}
            listOtherItem={stakeholdersOther}
            notes={stakeholdersNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'helpdeskUse',
          <ReadOnlySection
            heading={t('helpDesk')}
            copy={translateBooleanOrNull(helpdeskUse)}
            notes={helpdeskUseNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'contractorSupport',
          <ReadOnlySection
            heading={t('whatContractors')}
            list
            listItems={contractorSupport?.map(translateContractorSupportType)}
            listOtherItem={contractorSupportOther}
            notes={contractorSupportNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'contractorSupportHow',
          <ReadOnlySection
            heading={t('whatContractorsHow')}
            copy={contractorSupportHow}
          />
        )}
      </div>

      {/* IDDOC */}

      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        {!isViewingFilteredView && (
          <h3>{readOnly('opsEvalAndLearning.headings.iddoc')}</h3>
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'iddocSupport',
          <ReadOnlySection
            heading={t('iddocSupport')}
            copy={translateBooleanOrNull(iddocSupport)}
            notes={iddocSupportNote}
          />
        )}

        {(isViewingFilteredView || iddocSupport) &&
          checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'technicalContactsIdentified',
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

        {(isViewingFilteredView || iddocSupport) && (
          <>
            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'iddocSupport',
              <ReadOnlySection
                heading={h('note')}
                copy={technicalContactsIdentifiedNote}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'captureParticipantInfo',
              <ReadOnlySection
                heading={t('participantInformation')}
                copy={translateBooleanOrNull(captureParticipantInfo)}
                notes={captureParticipantInfoNote}
              />
            )}
          </>
        )}
      </div>

      {/* Interface Control Document - ICD */}
      {(isViewingFilteredView || iddocSupport) && (
        <>
          <div
            className={`${
              isViewingFilteredView
                ? ''
                : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
            }`}
          >
            {!isViewingFilteredView && (
              <h3>{readOnly('opsEvalAndLearning.headings.icd')}</h3>
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'icdOwner',
              <ReadOnlySection heading={t('icdOwner')} copy={icdOwner} />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'draftIcdDueDate',
              <ReadOnlySection
                heading={t('draftIDC')}
                copy={
                  draftIcdDueDate &&
                  formatDateUtc(draftIcdDueDate, 'MM/dd/yyyy')
                }
                notes={icdNote}
              />
            )}
          </div>

          {/* IDDOCTesting */}
          <div
            className={`${
              isViewingFilteredView
                ? ''
                : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
            }`}
          >
            {!isViewingFilteredView && (
              <h3>{readOnly('opsEvalAndLearning.headings.testing')}</h3>
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'uatNeeds',
              <ReadOnlySection heading={t('uatNeeds')} copy={uatNeeds} />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'stcNeeds',
              <ReadOnlySection heading={t('stcNeeds')} copy={stcNeeds} />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'testingTimelines',
              <ReadOnlySection
                heading={t('testingTimelines')}
                copy={testingTimelines}
                notes={testingNote}
              />
            )}
          </div>

          {/* IDDOCMonitoring */}
          <div
            className={`${
              isViewingFilteredView
                ? ''
                : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
            }`}
          >
            {!isViewingFilteredView && (
              <h3>{readOnly('opsEvalAndLearning.headings.dataMonitoring')}</h3>
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'dataMonitoringFileTypes',
              <ReadOnlySection
                heading={t('fileTypes')}
                list
                listItems={dataMonitoringFileTypes?.map(
                  translateMonitoringFileType
                )}
                listOtherItem={dataMonitoringFileOther}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'dataResponseType',
              <ReadOnlySection
                heading={t('responseTypes')}
                copy={dataResponseType}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'dataResponseFileFrequency',
              <ReadOnlySection
                heading={t('fileFrequency')}
                copy={dataResponseFileFrequency}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'dataFullTimeOrIncremental',
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
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'unsolicitedAdjustmentsIncluded',
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
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'produceBenefitEnhancementFiles',
              <ReadOnlySection
                heading={t('benefitEnhancement')}
                copy={translateBooleanOrNull(produceBenefitEnhancementFiles)}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'fileNamingConventions',
              <ReadOnlySection
                heading={t('namingConventions')}
                copy={fileNamingConventions}
                notes={dataMonitoringNote}
              />
            )}
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
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'benchmarkForPerformance',
          <ReadOnlySection
            heading={t('establishBenchmark')}
            copy={
              benchmarkForPerformance &&
              translateBenchmarkForPerformanceType(benchmarkForPerformance)
            }
            notes={benchmarkForPerformanceNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'computePerformanceScores',
          <ReadOnlySection
            heading={t('computeScores')}
            copy={translateBooleanOrNull(computePerformanceScores)}
            notes={computePerformanceScoresNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'riskAdjustPerformance',
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
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'riskAdjustPayments',
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
        )}

        {/* This is a slight "hack" of this component in order to get around the heading being required */}
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'riskAdjustPayments',
          <ReadOnlySection heading={h('note')} copy={riskAdjustNote} />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'appealPerformance',
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
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'appealPayments',
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
        )}

        {/* This is a slight "hack" of this component in order to get around the heading being required */}
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'appealPayments',
          <ReadOnlySection heading={h('note')} copy={appealNote} />
        )}
      </div>

      {/* Evaluation */}
      <div
        className={`${
          isViewingFilteredView
            ? ''
            : 'margin-bottom-4 padding-bottom-2 border-bottom-1px border-base-light'
        }`}
      >
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'evaluationApproaches',
          <ReadOnlySection
            heading={readOnly('opsEvalAndLearning.evaluationApproach')}
            list
            listItems={evaluationApproaches?.map(
              translateEvaluationApproachType
            )}
            listOtherItem={evaluationApproachOther}
            notes={evalutaionApproachNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'ccmInvolvment',
          <ReadOnlySection
            heading={t('ccw')}
            list
            listItems={ccmInvolvment?.map(translateCcmInvolvmentType)}
            listOtherItem={ccmInvolvmentOther}
            notes={ccmInvolvmentNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'dataNeededForMonitoring',
          <ReadOnlySection
            heading={readOnly('opsEvalAndLearning.dataNeeded')}
            list
            listItems={dataNeededForMonitoring?.map(
              translateDataForMonitoringType
            )}
            listOtherItem={dataNeededForMonitoringOther}
            notes={dataNeededForMonitoringNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'dataToSendParticicipants',
          <ReadOnlySection
            heading={readOnly('opsEvalAndLearning.dataToSend')}
            list
            listItems={dataToSendParticicipants?.map(
              translateDataToSendParticipantsType
            )}
            listOtherItem={dataToSendParticicipantsOther}
            notes={dataToSendParticicipantsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'shareCclfData',
          <ReadOnlySection
            heading={t('claimLineFeed')}
            copy={translateBooleanOrNull(shareCclfData)}
            notes={shareCclfDataNote}
          />
        )}
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
          {!isViewingFilteredView && (
            <h3>{readOnly('opsEvalAndLearning.headings.ccw')}</h3>
          )}

          {checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'sendFilesBetweenCcw',
            <ReadOnlySection
              heading={t('ccwSendFiles')}
              copy={translateBooleanOrNull(sendFilesBetweenCcw)}
              notes={sendFilesBetweenCcwNote}
            />
          )}

          {checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'appToSendFilesToKnown',
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
          )}

          {/* This is a slight "hack" of this component in order to get around the heading being required */}
          {checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'appToSendFilesToKnown',
            <ReadOnlySection heading={h('note')} copy={appToSendFilesToNote} />
          )}

          {checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'useCcwForFileDistribiutionToParticipants',
            <ReadOnlySection
              heading={t('distributeFiles')}
              copy={translateBooleanOrNull(
                useCcwForFileDistribiutionToParticipants
              )}
              notes={useCcwForFileDistribiutionToParticipantsNote}
            />
          )}
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
          {!isViewingFilteredView && (
            <h3>{readOnly('opsEvalAndLearning.headings.quality')}</h3>
          )}

          {checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'developNewQualityMeasures',
            <ReadOnlySection
              heading={t('validatedQuality')}
              copy={translateBooleanOrNull(developNewQualityMeasures)}
              notes={developNewQualityMeasuresNote}
            />
          )}

          {checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'qualityPerformanceImpactsPayment',
            <ReadOnlySection
              heading={t('impactPayment')}
              copy={translateBooleanOrNull(qualityPerformanceImpactsPayment)}
              notes={qualityPerformanceImpactsPaymentNote}
            />
          )}
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
        {!isViewingFilteredView && (
          <h3>{readOnly('opsEvalAndLearning.headings.data')}</h3>
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'dataSharingStarts',
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
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'dataSharingFrequency',
          <ReadOnlySection
            heading={t('dataSharingHowOften')}
            list
            listItems={dataSharingFrequency?.map(translateDataFrequencyType)}
            listOtherItem={dataSharingFrequencyOther}
            notes={dataSharingStartsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'dataCollectionStarts',
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
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'dataCollectionFrequency',
          <ReadOnlySection
            heading={t('dataCollectionHowOften')}
            list
            listItems={dataCollectionFrequency?.map(translateDataFrequencyType)}
            listOtherItem={dataCollectionFrequencyOther}
            notes={dataCollectionFrequencyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'qualityReportingStarts',
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
        )}
      </div>

      {/* Learning */}
      <div>
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'modelLearningSystems',
          <ReadOnlySection
            heading={t('learningSystem')}
            list
            listItems={modelLearningSystems?.map(
              translateModelLearningSystemType
            )}
            listOtherItem={modelLearningSystemsOther}
            notes={modelLearningSystemsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'anticipatedChallenges',
          <ReadOnlySection
            heading={t('obstacles')}
            copy={anticipatedChallenges}
          />
        )}
      </div>
    </div>
  );
};

export default ReadOnlyOpsEvalAndLearning;
