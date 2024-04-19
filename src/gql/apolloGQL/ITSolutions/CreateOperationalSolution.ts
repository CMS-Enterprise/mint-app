import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateOperationalSolution(
    $operationalNeedID: UUID!
    $solutionType: OperationalSolutionKey
    $changes: OperationalSolutionChanges!
  ) {
    createOperationalSolution(
      operationalNeedID: $operationalNeedID
      solutionType: $solutionType
      changes: $changes
    ) {
      id
      nameOther
      needed
      key
    }
  }
`);
