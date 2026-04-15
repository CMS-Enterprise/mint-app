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
          question
          answer
        }
      }
      categoryName
      subCategoryName
      facilitatedByRole
      facilitatedByOther
      commonSolutions {
        key
      }
    }
  }
`);
