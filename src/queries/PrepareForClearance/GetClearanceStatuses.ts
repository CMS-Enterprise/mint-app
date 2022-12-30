import { gql } from '@apollo/client';

export default gql`
  query GetClearanceStatuses($id: UUID!) {
    modelPlan(id: $id) {
      id
      basics {
        id
        readyForClearanceBy
        readyForClearanceDts
        status
      }
      generalCharacteristics {
        id
        readyForClearanceBy
        readyForClearanceDts
        status
      }
      participantsAndProviders {
        id
        readyForClearanceBy
        readyForClearanceDts
        status
      }
      beneficiaries {
        id
        readyForClearanceBy
        readyForClearanceDts
        status
      }
      opsEvalAndLearning {
        id
        readyForClearanceBy
        readyForClearanceDts
        status
      }
      payments {
        id
        readyForClearanceBy
        readyForClearanceDts
        status
      }
    }
  }
`;
