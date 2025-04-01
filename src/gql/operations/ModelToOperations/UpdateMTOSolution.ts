import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateMTOSolution($id: UUID!, $changes: MTOSolutionChanges!) {
    updateMTOSolution(id: $id, changes: $changes) {
      id
    }
  }
`);
