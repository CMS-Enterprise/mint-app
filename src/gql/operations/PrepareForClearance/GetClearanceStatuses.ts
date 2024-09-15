import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetClearanceStatuses($id: UUID!) {
    modelPlan(id: $id) {
      id
      basics {
        id
        readyForClearanceByUserAccount {
          id
          commonName
        }
        readyForClearanceDts
        status
      }
      generalCharacteristics {
        id
        readyForClearanceByUserAccount {
          id
          commonName
        }
        readyForClearanceDts
        status
      }
      participantsAndProviders {
        id
        readyForClearanceByUserAccount {
          id
          commonName
        }
        readyForClearanceDts
        status
      }
      beneficiaries {
        id
        readyForClearanceByUserAccount {
          id
          commonName
        }
        readyForClearanceDts
        status
      }
      opsEvalAndLearning {
        id
        readyForClearanceByUserAccount {
          id
          commonName
        }
        readyForClearanceDts
        status
      }
      payments {
        id
        readyForClearanceByUserAccount {
          id
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
`);
