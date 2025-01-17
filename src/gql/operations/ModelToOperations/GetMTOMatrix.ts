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
              addedFromMilestoneLibrary
              isDraft
              solutions {
                id
                name
                key
              }
            }
          }
        }
        milestones {
          id
        }
        commonMilestones {
          isSuggested
          isAdded
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
