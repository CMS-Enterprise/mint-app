import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetLearning($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
        dataNeededForMonitoring
        iddocSupport
        modelLearningSystems
        modelLearningSystemsOther
        modelLearningSystemsNote
        anticipatedChallenges
        readyForReviewByUserAccount {
          id
          commonName
        }
        readyForReviewDts
        status
      }
    }
  }
`);
