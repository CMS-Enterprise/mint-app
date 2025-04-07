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
          name
          key
          isAdded
          isSuggested
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
