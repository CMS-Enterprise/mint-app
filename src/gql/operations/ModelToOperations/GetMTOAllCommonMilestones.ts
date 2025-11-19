import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOAllCommonMilestones {
    mtoCommonMilestones {
      name
      description
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
`);
