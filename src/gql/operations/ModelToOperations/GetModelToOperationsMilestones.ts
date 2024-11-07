import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelToOperationsMatrix($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        status
        categories {
          id
          name
          isUncategorized
          subCategories {
            id
            name
            isUncategorized
            milestones {
              id
              name
              key
              facilitatedBy
              needBy
              status
              riskIndicator
              solutions {
                id
                name
                key
              }
            }
          }
        }
        recentEdit {
          id: modifiedBy
          modifiedByUserAccount {
            id
            commonName
          }
          modifiedDts
        }
      }
    }
  }
`);
