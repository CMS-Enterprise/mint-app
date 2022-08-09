import { gql } from '@apollo/client';

export default gql`
  mutation ArchiveModelPlan($id: UUID!, $archived: Boolean!) {
    updateModelPlan(id: $id, changes: { archived: $archived }) {
      id
    }
  }
`;
