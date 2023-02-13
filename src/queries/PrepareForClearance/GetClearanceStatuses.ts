import { gql } from '@apollo/client';

export default gql`
  query GetClearanceStatuses($id: UUID!) {
    modelPlan(id: $id) {
      id
      basics {
        id
        readyForClearanceByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      generalCharacteristics {
        id
        readyForClearanceByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      participantsAndProviders {
        id
        readyForClearanceByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      beneficiaries {
        id
        readyForClearanceByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      opsEvalAndLearning {
        id
        readyForClearanceByUserAccount {
          commonName
        }
        readyForClearanceDts
        status
      }
      payments {
        id
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
