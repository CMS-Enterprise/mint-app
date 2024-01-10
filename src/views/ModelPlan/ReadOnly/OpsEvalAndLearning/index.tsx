import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DataStartsType,
  GetAllOpsEvalAndLearningQuery,
  useGetAllOpsEvalAndLearningQuery
} from 'gql/gen/graphql';

import usePlanTranslation from 'hooks/usePlanTranslation';
import { formatDateUtc } from 'utils/date';
import { ModelInfoContext } from 'views/ModelInfoWrapper';
import {
  isCCWInvolvement,
  isQualityMeasures
} from 'views/ModelPlan/TaskList/OpsEvalAndLearning';
import { NotFoundPartial } from 'views/NotFound';

import { checkGroupMap } from '../_components/FilterView/util';
import ReadOnlySection, {
  formatListItems,
  formatListOtherItems
} from '../_components/ReadOnlySection';
import SideBySideReadOnlySection from '../_components/SideBySideReadOnlySection';
import TitleAndStatus from '../_components/TitleAndStatus';
import { ReadOnlyProps } from '../ModelBasics';

const ReadOnlyOpsEvalAndLearning = ({
  modelID,
  clearance,
  isViewingFilteredView,
  filteredQuestions
}: ReadOnlyProps) => {
  const { t: opsEvalAndLearningT } = useTranslation('opsEvalAndLearning');

  const { t: opsEvalAndLearningMiscT } = useTranslation(
    'opsEvalAndLearningMisc'
  );

  const { t: prepareForClearanceT } = useTranslation('prepareForClearance');

  const {
    dataSharingFrequency: dataSharingFrequencyConfig,
    dataCollectionFrequency: dataCollectionFrequencyConfig,
    qualityReportingFrequency: qualityReportingFrequencyConfig
  } = usePlanTranslation('opsEvalAndLearning');

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
    dataSharingStartsNote,
    dataCollectionStarts,
    dataCollectionStartsOther,
    dataCollectionFrequency,
    dataCollectionFrequencyNote,
    qualityReportingStarts,
    qualityReportingStartsOther,
    qualityReportingStartsNote,
    qualityReportingFrequency,
    // Learning
    modelLearningSystems,
    modelLearningSystemsOther,
    modelLearningSystemsNote,
    anticipatedChallenges,
    status
  } = allOpsEvalAndLearningData;

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
        status={status}
      />

      {clearance && (
        <p className="font-body-lg margin-top-neg-2 margin-bottom-6">
          {prepareForClearanceT('forModelPlan', {
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
            heading={opsEvalAndLearningT('agencyOrStateHelp.readonlyLabel')}
            list
            listItems={agencyOrStateHelp?.map((type): string =>
              opsEvalAndLearningT(`agencyOrStateHelp.options.${type}`)
            )}
            listOtherItem={agencyOrStateHelpOther}
            notes={agencyOrStateHelpNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'stakeholders',
          <ReadOnlySection
            heading={opsEvalAndLearningT('stakeholders.label')}
            list
            listItems={stakeholders?.map((type): string =>
              opsEvalAndLearningT(`stakeholders.options.${type}`)
            )}
            listOtherItem={stakeholdersOther}
            notes={stakeholdersNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'helpdeskUse',
          <ReadOnlySection
            heading={opsEvalAndLearningT('helpdeskUse.label')}
            copy={opsEvalAndLearningT(`helpdeskUse.options.${helpdeskUse}`, '')}
            notes={helpdeskUseNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'contractorSupport',
          <SideBySideReadOnlySection
            firstSection={{
              heading: opsEvalAndLearningT('contractorSupport.label'),
              list: true,
              listItems: contractorSupport?.map((type): string =>
                opsEvalAndLearningT(`contractorSupport.options.${type}`)
              ),
              listOtherItem: contractorSupportOther
            }}
            secondSection={{
              heading: opsEvalAndLearningT('contractorSupportHow.label'),
              copy: contractorSupportHow
            }}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'contractorSupport',
          <ReadOnlySection
            heading={opsEvalAndLearningT('contractorSupportNote.label')}
            copy={contractorSupportNote}
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
          <h3>{opsEvalAndLearningMiscT('iddocReadonlyHeading')}</h3>
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'iddocSupport',
          <ReadOnlySection
            heading={opsEvalAndLearningT('iddocSupport.label')}
            copy={opsEvalAndLearningT(
              `iddocSupport.options.${iddocSupport}`,
              ''
            )}
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
                heading: opsEvalAndLearningT(
                  'technicalContactsIdentified.label'
                ),
                copy: opsEvalAndLearningT(
                  `technicalContactsIdentified.options.${technicalContactsIdentified}`,
                  ''
                )
              }}
              secondSection={
                technicalContactsIdentified === true && {
                  heading: opsEvalAndLearningT(
                    'technicalContactsIdentifiedDetail.label'
                  ),
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
                heading={opsEvalAndLearningT(
                  'technicalContactsIdentifiedNote.label'
                )}
                copy={technicalContactsIdentifiedNote}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'captureParticipantInfo',
              <ReadOnlySection
                heading={opsEvalAndLearningT('captureParticipantInfo.label')}
                copy={opsEvalAndLearningT(
                  `captureParticipantInfo.options.${captureParticipantInfo}`,
                  ''
                )}
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
              <h3>{opsEvalAndLearningMiscT('icdReadonlyHeading')}</h3>
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'icdOwner',
              <ReadOnlySection
                heading={opsEvalAndLearningT('icdOwner.label')}
                copy={icdOwner}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'draftIcdDueDate',
              <ReadOnlySection
                heading={opsEvalAndLearningT('draftIcdDueDate.label')}
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
              <h3>{opsEvalAndLearningMiscT('testing')}</h3>
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'uatNeeds',
              <ReadOnlySection
                heading={opsEvalAndLearningT('uatNeeds.label')}
                copy={uatNeeds}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'stcNeeds',
              <ReadOnlySection
                heading={opsEvalAndLearningT('stcNeeds.label')}
                copy={stcNeeds}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'testingTimelines',
              <ReadOnlySection
                heading={opsEvalAndLearningT('testingTimelines.label')}
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
              <h3>{opsEvalAndLearningMiscT('dataMonitoringHeading')}</h3>
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'dataMonitoringFileTypes',
              <ReadOnlySection
                heading={opsEvalAndLearningT('dataMonitoringFileTypes.label')}
                list
                listItems={dataMonitoringFileTypes?.map((type): string =>
                  opsEvalAndLearningT(`dataMonitoringFileTypes.options.${type}`)
                )}
                listOtherItem={dataMonitoringFileOther}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'dataResponseType',
              <ReadOnlySection
                heading={opsEvalAndLearningT('dataResponseType.label')}
                copy={dataResponseType}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'dataResponseFileFrequency',
              <ReadOnlySection
                heading={opsEvalAndLearningT('dataResponseFileFrequency.label')}
                copy={dataResponseFileFrequency}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'dataFullTimeOrIncremental',
              <SideBySideReadOnlySection
                firstSection={{
                  heading: opsEvalAndLearningT(
                    'dataFullTimeOrIncremental.label'
                  ),
                  copy:
                    dataFullTimeOrIncremental &&
                    opsEvalAndLearningT(
                      `dataFullTimeOrIncremental.options.${dataFullTimeOrIncremental}`,
                      ''
                    )
                }}
                secondSection={{
                  heading: opsEvalAndLearningT('eftSetUp.label'),
                  copy: opsEvalAndLearningT(`eftSetUp.options.${eftSetUp}`, '')
                }}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'unsolicitedAdjustmentsIncluded',
              <SideBySideReadOnlySection
                firstSection={{
                  heading: opsEvalAndLearningT(
                    'unsolicitedAdjustmentsIncluded.label'
                  ),
                  copy: opsEvalAndLearningT(
                    `unsolicitedAdjustmentsIncluded.options.${unsolicitedAdjustmentsIncluded}`,
                    ''
                  )
                }}
                secondSection={{
                  heading: opsEvalAndLearningT('dataFlowDiagramsNeeded.label'),
                  copy: opsEvalAndLearningT(
                    `dataFlowDiagramsNeeded.options.${dataFlowDiagramsNeeded}`,
                    ''
                  )
                }}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'produceBenefitEnhancementFiles',
              <ReadOnlySection
                heading={opsEvalAndLearningT(
                  'produceBenefitEnhancementFiles.label'
                )}
                copy={opsEvalAndLearningT(
                  `produceBenefitEnhancementFiles.options.${produceBenefitEnhancementFiles}`,
                  ''
                )}
              />
            )}

            {checkGroupMap(
              isViewingFilteredView,
              filteredQuestions,
              'fileNamingConventions',
              <ReadOnlySection
                heading={opsEvalAndLearningT('fileNamingConventions.label')}
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
            heading={opsEvalAndLearningT('benchmarkForPerformance.label')}
            copy={
              benchmarkForPerformance &&
              opsEvalAndLearningT(
                `benchmarkForPerformance.options.${benchmarkForPerformance}`,
                ''
              )
            }
            notes={benchmarkForPerformanceNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'computePerformanceScores',
          <ReadOnlySection
            heading={opsEvalAndLearningT('computePerformanceScores.label')}
            copy={opsEvalAndLearningT(
              `computePerformanceScores.options.${computePerformanceScores}`,
              ''
            )}
            notes={computePerformanceScoresNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'riskAdjustPerformance',
          <SideBySideReadOnlySection
            firstSection={{
              heading: opsEvalAndLearningT(
                'riskAdjustPerformance.readonlyLabel'
              ),
              copy: opsEvalAndLearningT(
                `riskAdjustPerformance.options.${riskAdjustPerformance}`,
                ''
              )
            }}
            secondSection={{
              heading: opsEvalAndLearningT('riskAdjustFeedback.readonlyLabel'),
              copy: opsEvalAndLearningT(
                `riskAdjustFeedback.options.${riskAdjustFeedback}`,
                ''
              )
            }}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'riskAdjustPayments',
          <SideBySideReadOnlySection
            firstSection={{
              heading: opsEvalAndLearningT('riskAdjustPayments.readonlyLabel'),
              copy: opsEvalAndLearningT(
                `riskAdjustPayments.options.${riskAdjustPayments}`,
                ''
              )
            }}
            secondSection={{
              heading: opsEvalAndLearningT('riskAdjustOther.readonlyLabel'),
              copy: opsEvalAndLearningT(
                `riskAdjustOther.options.${riskAdjustOther}`,
                ''
              )
            }}
          />
        )}

        {/* This is a slight "hack" of this component in order to get around the heading being required */}
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'riskAdjustPayments',
          <ReadOnlySection
            heading={opsEvalAndLearningT('riskAdjustPayments.label')}
            copy={riskAdjustNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'appealPerformance',
          <SideBySideReadOnlySection
            firstSection={{
              heading: opsEvalAndLearningT('appealPerformance.readonlyLabel'),
              copy: opsEvalAndLearningT(
                `appealPerformance.options.${appealPerformance}`,
                ''
              )
            }}
            secondSection={{
              heading: opsEvalAndLearningT('appealFeedback.readonlyLabel'),
              copy: opsEvalAndLearningT(
                `appealFeedback.options.${appealFeedback}`,
                ''
              )
            }}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'appealPayments',
          <SideBySideReadOnlySection
            firstSection={{
              heading: opsEvalAndLearningT('appealPayments.readonlyLabel'),
              copy: opsEvalAndLearningT(
                `appealPayments.options.${appealPayments}`,
                ''
              )
            }}
            secondSection={{
              heading: opsEvalAndLearningT('appealOther.readonlyLabel'),
              copy: opsEvalAndLearningT(
                `appealOther.options.${appealOther}`,
                ''
              )
            }}
          />
        )}

        {/* This is a slight "hack" of this component in order to get around the heading being required */}
        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'appealPayments',
          <ReadOnlySection
            heading={opsEvalAndLearningT('appealPayments.label')}
            copy={appealNote}
          />
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
            heading={opsEvalAndLearningT('evaluationApproaches.readonlyLabel')}
            list
            listItems={evaluationApproaches?.map((type): string =>
              opsEvalAndLearningT(`evaluationApproaches.options.${type}`)
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
            heading={opsEvalAndLearningT('ccmInvolvment.label')}
            list
            listItems={ccmInvolvment?.map((type): string =>
              opsEvalAndLearningT(`ccmInvolvment.options.${type}`)
            )}
            listOtherItem={ccmInvolvmentOther}
            notes={ccmInvolvmentNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'dataNeededForMonitoring',
          <ReadOnlySection
            heading={opsEvalAndLearningT(
              'dataNeededForMonitoring.readonlyLabel'
            )}
            list
            listItems={dataNeededForMonitoring?.map((type): string =>
              opsEvalAndLearningT(`dataNeededForMonitoring.options.${type}`)
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
            heading={opsEvalAndLearningT(
              'dataToSendParticicipants.readonlyLabel'
            )}
            list
            listItems={dataToSendParticicipants?.map((type): string =>
              opsEvalAndLearningT(`dataToSendParticicipants.options.${type}`)
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
            heading={opsEvalAndLearningT('shareCclfData.label')}
            copy={opsEvalAndLearningT(
              `shareCclfData.options.${shareCclfData}`,
              ''
            )}
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
            <h3>{opsEvalAndLearningMiscT('ccwSpecificReadonly')}</h3>
          )}

          {checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'sendFilesBetweenCcw',
            <ReadOnlySection
              heading={opsEvalAndLearningT('sendFilesBetweenCcw.label')}
              copy={opsEvalAndLearningT(
                `sendFilesBetweenCcw.options.${sendFilesBetweenCcw}`,
                ''
              )}
              notes={sendFilesBetweenCcwNote}
            />
          )}

          {checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'appToSendFilesToKnown',
            <SideBySideReadOnlySection
              firstSection={{
                heading: opsEvalAndLearningT('appToSendFilesToKnown.label'),
                copy: opsEvalAndLearningT(
                  `appToSendFilesToKnown.options.${appToSendFilesToKnown}`,
                  ''
                )
              }}
              secondSection={
                appToSendFilesToKnown === true && {
                  heading: opsEvalAndLearningT('appToSendFilesToWhich.label'),
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
            <ReadOnlySection
              heading={opsEvalAndLearningT('appToSendFilesToNote.label')}
              copy={appToSendFilesToNote}
            />
          )}

          {checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'useCcwForFileDistribiutionToParticipants',
            <ReadOnlySection
              heading={opsEvalAndLearningT(
                'useCcwForFileDistribiutionToParticipants.label'
              )}
              copy={opsEvalAndLearningT(
                `useCcwForFileDistribiutionToParticipants.options.${useCcwForFileDistribiutionToParticipants}`,
                ''
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
            <h3>{opsEvalAndLearningMiscT('qualityReadonly')}</h3>
          )}

          {checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'developNewQualityMeasures',
            <ReadOnlySection
              heading={opsEvalAndLearningT('developNewQualityMeasures.label')}
              copy={opsEvalAndLearningT(
                `developNewQualityMeasures.options.${developNewQualityMeasures}`,
                ''
              )}
              notes={developNewQualityMeasuresNote}
            />
          )}

          {checkGroupMap(
            isViewingFilteredView,
            filteredQuestions,
            'qualityPerformanceImpactsPayment',
            <ReadOnlySection
              heading={opsEvalAndLearningT(
                'qualityPerformanceImpactsPayment.label'
              )}
              copy={opsEvalAndLearningT(
                `qualityPerformanceImpactsPayment.options.${qualityPerformanceImpactsPayment}`,
                ''
              )}
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
          <h3>{opsEvalAndLearningMiscT('dataReadonly')}</h3>
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'dataSharingStarts',
          <ReadOnlySection
            heading={opsEvalAndLearningT('dataSharingStarts.label')}
            copy={
              dataSharingStarts &&
              (dataSharingStarts === DataStartsType.OTHER
                ? `${opsEvalAndLearningT(
                    `dataSharingStarts.options.${dataSharingStarts}`,
                    ''
                  )} \u2014  ${dataSharingStartsOther}`
                : opsEvalAndLearningT(
                    `dataSharingStarts.options.${dataSharingStarts}`,
                    ''
                  ))
            }
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'dataSharingFrequency',
          <ReadOnlySection
            heading={opsEvalAndLearningT('dataSharingFrequency.label')}
            list
            listItems={formatListItems(
              dataSharingFrequencyConfig,
              dataSharingFrequency
            )}
            listOtherItems={formatListOtherItems(
              dataSharingFrequencyConfig,
              dataSharingFrequency,
              allOpsEvalAndLearningData
            )}
            notes={dataSharingStartsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'dataCollectionStarts',
          <ReadOnlySection
            heading={opsEvalAndLearningT('dataCollectionStarts.label')}
            copy={
              dataCollectionStarts &&
              (dataCollectionStarts === DataStartsType.OTHER
                ? `${opsEvalAndLearningT(
                    `dataCollectionStarts.options.${dataCollectionStarts}`,
                    ''
                  )} \u2014  ${dataCollectionStartsOther}`
                : opsEvalAndLearningT(
                    `dataCollectionStarts.options.${dataCollectionStarts}`,
                    ''
                  ))
            }
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'dataCollectionFrequency',
          <ReadOnlySection
            heading={opsEvalAndLearningT('dataCollectionFrequency.label')}
            list
            listItems={formatListItems(
              dataCollectionFrequencyConfig,
              dataCollectionFrequency
            )}
            listOtherItems={formatListOtherItems(
              dataCollectionFrequencyConfig,
              dataCollectionFrequency,
              allOpsEvalAndLearningData
            )}
            notes={dataCollectionFrequencyNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'qualityReportingStarts',
          <ReadOnlySection
            heading={opsEvalAndLearningT('qualityReportingStarts.label')}
            copy={
              qualityReportingStarts &&
              (qualityReportingStarts === DataStartsType.OTHER
                ? `${opsEvalAndLearningT(
                    `qualityReportingStarts.options.${qualityReportingStarts}`,
                    ''
                  )} \u2014  ${qualityReportingStartsOther}`
                : opsEvalAndLearningT(
                    `qualityReportingStarts.options.${qualityReportingStarts}`,
                    ''
                  ))
            }
            notes={qualityReportingStartsNote}
          />
        )}

        {checkGroupMap(
          isViewingFilteredView,
          filteredQuestions,
          'qualityReportingFrequency',
          <ReadOnlySection
            heading={opsEvalAndLearningT('qualityReportingFrequency.label')}
            list
            listItems={formatListItems(
              qualityReportingFrequencyConfig,
              qualityReportingFrequency
            )}
            listOtherItems={formatListOtherItems(
              qualityReportingFrequencyConfig,
              qualityReportingFrequency,
              allOpsEvalAndLearningData
            )}
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
            heading={opsEvalAndLearningT('modelLearningSystems.label')}
            list
            listItems={modelLearningSystems?.map((type): string =>
              opsEvalAndLearningT(`modelLearningSystems.options.${type}`)
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
            heading={opsEvalAndLearningT('anticipatedChallenges.label')}
            copy={anticipatedChallenges}
          />
        )}
      </div>
    </div>
  );
};

export default ReadOnlyOpsEvalAndLearning;
