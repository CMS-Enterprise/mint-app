import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetIsCollaborator($id: UUID!) {
    modelPlan(id: $id) {
      id
      isCollaborator
    }
  }
`);
