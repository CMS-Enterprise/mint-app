import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateMTOCommonSolutionContractor(
    $id: UUID!
    $changes: MTOCommonSolutionContractorChanges!
  ) {
    updateMTOCommonSolutionContractor(id: $id, changes: $changes) {
      id
      key
      contractorTitle
      contractorName
      createdBy
    }
  }
`);
