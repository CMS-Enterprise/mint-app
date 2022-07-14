import { gql } from '@apollo/client';

export default gql`
  query GetITToolPageOne($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      generalCharacteristics {
        id
        managePartCDEnrollment
        collectPlanBids
        planContactUpdated
      }
      itTools {
        id
        gcPartCD
        gcPartCDOther
        gcPartCDNote
        gcCollectBids
        gcCollectBidsOther
        gcCollectBidsNote
        gcUpdateContract
        gcUpdateContractOther
        gcUpdateContractNote
      }
    }
  }
`;
