import { gql } from '@apollo/client';

export default gql`
  query GetIDDOCMonitoring($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
        iddocSupport
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
`;
