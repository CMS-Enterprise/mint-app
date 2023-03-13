import { gql } from '@apollo/client';

export default gql`
  mutation CreateOperationalSolutionSubtasks(
    $solutionID: UUID!
    $inputs: [CreateOperationalSolutionSubtaskInput!]!
  ) {
    createOperationalSolutionSubtasks(
      solutionID: $solutionID
      inputs: $inputs
    ) {
      id
      name
      status
    }
  }
`;
