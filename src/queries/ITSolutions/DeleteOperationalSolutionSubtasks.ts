import { gql } from '@apollo/client';

export default gql`
  mutation DeleteOperationalSolutionSubtask($id: UUID!) {
    deleteOperationalSolutionSubtask(id: $id)
  }
`;
