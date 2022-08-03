import { gql } from '@apollo/client';

export default gql`
  query GetITToolPageFive($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        appealPerformance
        appealFeedback
        appealPayments
        appealOther
        evaluationApproaches
        dataNeededForMonitoring
      }
      itTools {
        id
        oelProcessAppeals
        oelProcessAppealsOther
        oelProcessAppealsNote
        oelEvaluationContractor
        oelEvaluationContractorOther
        oelEvaluationContractorNote
        oelCollectData
        oelCollectDataOther
        oelCollectDataNote
      }
    }
  }
`;
