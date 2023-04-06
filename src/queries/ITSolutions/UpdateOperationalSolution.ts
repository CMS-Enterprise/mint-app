import { gql } from '@apollo/client';

export default gql`
  mutation UpdateOperationalSolution(
    $id: UUID!
    $changes: OperationalSolutionChanges!
  ) {
    updateOperationalSolution(id: $id, changes: $changes) {
      id
    }
  }
`;
