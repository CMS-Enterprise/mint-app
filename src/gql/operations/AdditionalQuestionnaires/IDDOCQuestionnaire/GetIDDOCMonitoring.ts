import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetIDDOCQuestionnaireMonitoring($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      questionnaires {
        iddocQuestionnaire {
          id
          dataFullTimeOrIncremental
          eftSetUp
          unsolicitedAdjustmentsIncluded
          dataFlowDiagramsNeeded
          produceBenefitEnhancementFiles
          fileNamingConventions
          dataMonitoringNote
        }
      }
    }
  }
`);
