import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteOperationalSolutionSubtask($id: UUID!) {
    deleteOperationalSolutionSubtask(id: $id)
  }
`);
