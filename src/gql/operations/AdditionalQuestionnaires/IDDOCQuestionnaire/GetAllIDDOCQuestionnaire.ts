import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllIddocQuestionnaire($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      questionnaires {
        iddocQuestionnaire {
          id
          technicalContactsIdentified
          technicalContactsIdentifiedDetail
          technicalContactsIdentifiedNote
          captureParticipantInfo
          captureParticipantInfoNote
          icdOwner
          draftIcdDueDate
          icdNote

          uatNeeds
          stcNeeds
          testingTimelines
          testingNote
          dataMonitoringFileTypes
          dataMonitoringFileOther
          dataResponseType
          dataResponseFileFrequency

          dataFullTimeOrIncremental
          eftSetUp
          unsolicitedAdjustmentsIncluded
          dataFlowDiagramsNeeded
          produceBenefitEnhancementFiles
          fileNamingConventions
          dataMonitoringNote

          needed
          modifiedDts
          createdDts
          status
        }
      }
    }
  }
`);
