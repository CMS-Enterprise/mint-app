import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOMilestones($id: UUID!) {
    modelPlan(id: $id) {
      id
      mtoMatrix {
        commonMilestones {
          name
          key
          isAdded
          isSuggested
          categoryName
          subCategoryName
          commonSolutions {
            key
          }
        }
      }
    }
  }
`);
