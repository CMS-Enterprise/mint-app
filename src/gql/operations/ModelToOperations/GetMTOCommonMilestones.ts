import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOMilestones($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        # Used to cache the mto matrix - always include
        info {
          id
        }
        commonMilestones {
          id
          name
          description
          isArchived
          isAdded
          suggested {
            isSuggested
            count
            reasons {
              table
              field
              answer
            }
          }
          categoryName
          subCategoryName
          facilitatedByRole
          commonSolutions {
            key
          }
        }
      }
    }
  }
`);
