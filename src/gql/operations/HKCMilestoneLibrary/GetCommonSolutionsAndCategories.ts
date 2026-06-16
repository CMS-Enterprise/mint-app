import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCommonSolutionsAndCategories {
    mtoCommonSolutions {
      name
      key
    }
    commonCategories {
      name
      subCategories
    }
  }
`);
