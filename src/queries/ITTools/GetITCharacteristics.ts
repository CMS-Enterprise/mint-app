import { gql } from '@apollo/client';

export default gql`
  query GetITCharacteristics($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      generalCharacteristics {
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
