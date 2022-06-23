import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanOpsEvalAndLearning($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        #Page 1
        agencyOrStateHelp
        agencyOrStateHelpOther
        agencyOrStateHelpNote
        stakeholders
        stakeholdersOther
        stakeholdersNote
        helpdeskUse
        helpdeskUseOther
        helpdeskUseNote
        contractorSupport
        contractorSupportOther
        contractorSupportHow
        contractorSupportNote
        iddocSupport
        iddocSupportNote
        #Page 2
        iddocOperations
        iddocOperationsOther
        iddocOperationsNote
        technicalContactsIdentified
        technicalContactsIdentifiedDetail
        technicalContactsIdentifiedNote
        captureParticipantInfo
        captureParticipantInfoNote
        icdOwner
        draftIcdDueDate
        icdNote
        #Page 3
        uatNeeds
        stcNeeds
        testingTimelines
        testingNote
        dataMonitoringFileTypes
        dataMonitoringFileOther
        dataResponseType
        dataResponseFileFrequency
        #Page 4
        dataFullTimeOrIncremental
        eftSetUp
        unsolicitedAdjustmentsIncluded
        dataFlowDiagramsNeeded
        produceBenefitEnhancementFiles
        fileNamingConventions
        dataMonitoringNote
        #Page 5
        benchmarkForPerformance
        benchmarkForPerformanceNote
        computePerformanceScores
        computePerformanceScoresNote
        riskAdjustPerformance
        riskAdjustFeedback
        riskAdjustPayments
        riskAdjustOther
        riskAdjustNote
        appealPerformance
        appealFeedback
        appealPayments
        appealOther
        appealNote
        #Page 6
        evaluationApproaches
        evaluationApproachOther
        evalutaionApproachNote
        ccmInvolvment
        ccmInvolvmentOther
        ccmInvolvmentNote
        dataNeededForMonitoring
        dataNeededForMonitoringOther
        dataNeededForMonitoringNote
        dataToSendParticicipants
        dataToSendParticicipantsOther
        dataToSendParticicipantsNote
        shareCclfData
        shareCclfDataNote
        #Page 7
        sendFilesBetweenCcw
        sendFilesBetweenCcwNote
        appToSendFilesToKnown
        appToSendFilesToWhich
        appToSendFilesToNote
        useCcwForFileDistribiutionToParticipants
        useCcwForFileDistribiutionToParticipantsNote
        developNewQualityMeasures
        developNewQualityMeasuresNote
        qualityPerformanceImpactsPayment
        qualityPerformanceImpactsPaymentNote
        #Page 8
        dataSharingStarts
        dataSharingStartsOther
        dataSharingFrequency
        dataSharingFrequencyOther
        dataSharingStartsNote
        dataCollectionStarts
        dataCollectionStartsOther
        dataCollectionFrequency
        dataCollectionFrequencyOther
        dataCollectionFrequencyNote
        qualityReportingStarts
        qualityReportingStartsOther
        qualityReportingStartsNote
        #Page 9
        modelLearningSystems
        modelLearningSystemsOther
        modelLearningSystemsNote
        anticipatedChallenges

        status
      }
    }
  }
`;
