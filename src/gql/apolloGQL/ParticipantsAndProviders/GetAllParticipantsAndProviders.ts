import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllParticipantsAndProviders($id: UUID!) {
    modelPlan(id: $id) {
      id
      participantsAndProviders {
        id
        participants
        medicareProviderType
        statesEngagement
        participantsOther
        participantsNote
        participantsCurrentlyInModels
        participantsCurrentlyInModelsNote
        modelApplicationLevel
        expectedNumberOfParticipants
        estimateConfidence
        confidenceNote
        recruitmentMethod
        recruitmentOther
        recruitmentNote
        selectionMethod
        selectionOther
        selectionNote
        communicationMethod
        communicationMethodOther
        communicationNote
        participantAssumeRisk
        riskType
        riskOther
        riskNote
        willRiskChange
        willRiskChangeNote
        coordinateWork
        coordinateWorkNote
        gainsharePayments
        gainsharePaymentsTrack
        gainsharePaymentsNote
        gainsharePaymentsEligibility
        gainsharePaymentsEligibilityOther
        participantsIds
        participantsIdsOther
        participantsIDSNote
        providerAdditionFrequency
        providerAdditionFrequencyContinually
        providerAdditionFrequencyOther
        providerAdditionFrequencyNote
        providerAddMethod
        providerAddMethodOther
        providerAddMethodNote
        providerLeaveMethod
        providerLeaveMethodOther
        providerLeaveMethodNote
        providerOverlap
        providerOverlapHierarchy
        providerOverlapNote
        status
      }
    }
  }
`);
