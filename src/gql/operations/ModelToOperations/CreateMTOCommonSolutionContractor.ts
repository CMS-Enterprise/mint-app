import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOCommonSolutionContractor(
    $key: MTOCommonSolutionKey!
    $contractTitle: String
    $contractorName: String!
  ) {
    createMTOCommonSolutionContractor(
      key: $key
      contractTitle: $contractTitle
      contractorName: $contractorName
    ) {
      id
      key
      contractTitle
      contractorName
    }
  }
`);
