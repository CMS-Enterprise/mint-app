import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation ArchiveModelPlan($id: UUID!, $archived: Boolean!) {
    updateModelPlan(id: $id, changes: { archived: $archived }) {
      id
    }
  }
`);
