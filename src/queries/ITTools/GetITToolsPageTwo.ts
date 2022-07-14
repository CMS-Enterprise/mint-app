import { gql } from '@apollo/client';

export default gql`
  query GetITToolPageTwo($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      participantsAndProviders {
        id
        recruitmentMethod
        selectionMethod
      }
      itTools {
        id
        ppToAdvertise
        ppToAdvertiseOther
        ppToAdvertiseNote
        ppCollectScoreReview
        ppCollectScoreReviewOther
        ppCollectScoreReviewNote
        ppAppSupportContractor
        ppAppSupportContractorOther
        ppAppSupportContractorNote
      }
    }
  }
`;
