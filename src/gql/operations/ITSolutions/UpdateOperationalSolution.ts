import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateOperationalSolution(
    $id: UUID!
    $changes: OperationalSolutionChanges!
  ) {
    updateOperationalSolution(id: $id, changes: $changes) {
      id
      nameOther
      needed
      key
    }
  }
`);
