import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetGlobalMTOCommonSolutions() {
    mtoCommonSolutions {
      name
      key
      type
      subjects
      isAdded
    }
  }
`);
