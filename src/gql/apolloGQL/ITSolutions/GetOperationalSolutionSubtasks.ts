import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
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
`);
