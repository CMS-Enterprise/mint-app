import { gql } from '@apollo/client';

export default gql`
  query GetClearanceStatuses($id: UUID!) {
    modelPlan(id: $id) {
      id
      basics {
        id
        readyForClearanceBy
        readyForClearanceByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      generalCharacteristics {
        id
        readyForClearanceBy
        readyForClearanceByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      participantsAndProviders {
        id
        readyForClearanceBy
        readyForClearanceByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      beneficiaries {
        id
        readyForClearanceBy
        readyForClearanceByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      opsEvalAndLearning {
        id
        readyForClearanceBy
        readyForClearanceByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      payments {
        id
        readyForClearanceBy
        readyForClearanceByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      prepareForClearance {
        status
      }
    }
  }
`;
