import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateOperationalSolutionSubtasks(
    $solutionID: UUID!
    $inputs: [CreateOperationalSolutionSubtaskInput!]!
  ) {
    createOperationalSolutionSubtasks(
      solutionID: $solutionID
      inputs: $inputs
    ) {
      name
      status
    }
  }
`);
