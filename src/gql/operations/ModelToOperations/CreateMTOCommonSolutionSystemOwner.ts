import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateMTOCommonSolutionSystemOwner(
    $key: MTOCommonSolutionKey!
    $changes: MTOCommonSolutionSystemOwnerChanges!
  ) {
    createMTOCommonSolutionSystemOwner(key: $key, changes: $changes) {
      id
      key
      ownerType
      cmsComponent
    }
  }
`);
