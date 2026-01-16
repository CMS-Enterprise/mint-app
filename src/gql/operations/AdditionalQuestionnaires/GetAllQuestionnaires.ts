import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllQuestionnaires($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      abbreviation
      questionnaires {
        dataExchangeApproach {
          id
          status
          modifiedDts
          modifiedByUserAccount {
            id
            commonName
          }
        }
        iddocQuestionnaire {
          id
          status
          needed
          modifiedDts
          modifiedByUserAccount {
            id
            commonName
          }
        }
      }
    }
  }
`);
