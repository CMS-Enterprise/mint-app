import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOAllCommonMilestones {
    mtoCommonMilestones {
      id
      name
      description
      isArchived
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
`);
