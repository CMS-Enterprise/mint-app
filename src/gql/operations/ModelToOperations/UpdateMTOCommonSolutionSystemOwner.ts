import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateMTOCommonSolutionSystemOwner(
    $id: UUID!
    $changes: MTOCommonSolutionSystemOwnerChanges!
  ) {
    updateMTOCommonSolutionSystemOwner(id: $id, changes: $changes) {
      id
      key
      ownerType
      cmsComponent
      createdBy
    }
  }
`);
