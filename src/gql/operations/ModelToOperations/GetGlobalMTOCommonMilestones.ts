import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetGlobalMTOCommonMilestones() {
    mtoCommonSolutions {
      name
      key
      type
      subjects
      isAdded
    }
  }
`);
