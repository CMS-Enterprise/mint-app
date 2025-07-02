import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOCommonSolutionContractor(
    $key: MTOCommonSolutionKey!
    $contractorTitle: String
    $contractorName: String!
  ) {
    createMTOCommonSolutionContractor(
      key: $key
      contractorTitle: $contractorTitle
      contractorName: $contractorName
    ) {
      id
      key
      contractorTitle
      contractorName
    }
  }
`);
