import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllQuestionnaires($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      abbreviation
      dataExchangeApproach {
        id
        status
        modifiedDts
        modifiedByUserAccount {
          id
          commonName
        }
      }
      # iddocQuestionnaire {
      #   id
      #   status
      #   modifiedDts
      #   modifiedByUserAccount {
      #     id
      #     commonName
      #   }
      # }
    }
  }
`);
