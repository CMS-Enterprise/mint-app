import { gql } from '@apollo/client';

export default gql`
  query GetPerformance($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
        dataNeededForMonitoring
        iddocSupport
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
      }
      operationalNeeds {
        modifiedDts
      }
    }
  }
`;
