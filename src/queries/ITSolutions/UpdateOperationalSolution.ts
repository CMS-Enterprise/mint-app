import { gql } from '@apollo/client';

export default gql`
  mutation UpdateOperationalSolution(
    $operationalSolutionID: UUID!
    $changes: OperationalSolutionChanges!
  ) {
    updateOperationalSolution(id: $operationalSolutionID, changes: $changes) {
      id
    }
  }
`;
