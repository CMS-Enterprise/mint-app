import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOAllCommonMilestones {
    mtoCommonMilestones {
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
`);
