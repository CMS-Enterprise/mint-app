import { gql } from '@apollo/client';

export default gql`
  query GetITToolPageFour($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        helpdeskUse
        iddocSupport
        benchmarkForPerformance
      }
      itTools {
        id
        oelHelpdeskSupport
        oelHelpdeskSupportOther
        oelHelpdeskSupportNote
        oelManageAco
        oelManageAcoOther
        oelManageAcoNote
        oelPerformanceBenchmark
        oelPerformanceBenchmarkOther
        oelPerformanceBenchmarkNote
      }
    }
  }
`;
