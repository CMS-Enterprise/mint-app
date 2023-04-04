import { gql } from '@apollo/client';

export default gql`
  query GetOperationalSolutionSubtasks($id: UUID!) {
    operationalSolution(id: $id) {
      id
      operationalSolutionSubtasks {
        id
        solutionID
        name
        status
      }
    }
  }
`;
