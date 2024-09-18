import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateOperationalSolutionSubtasks(
    $inputs: [UpdateOperationalSolutionSubtaskInput!]!
  ) {
    updateOperationalSolutionSubtasks(inputs: $inputs) {
      id
      solutionID
      name
      status
    }
  }
`);
