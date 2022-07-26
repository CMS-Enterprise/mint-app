import { gql } from '@apollo/client';

export default gql`
  query GetLearning($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
        iddocSupport
        modelLearningSystems
        modelLearningSystemsOther
        modelLearningSystemsNote
        anticipatedChallenges
        readyForReviewBy
        readyForReviewDts
        status
      }
    }
  }
`;
