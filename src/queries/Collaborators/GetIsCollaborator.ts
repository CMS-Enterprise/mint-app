import { gql } from '@apollo/client';

export default gql`
  query GetIsCollaborator($id: UUID!) {
    modelPlan(id: $id) {
      id
      isCollaborator
    }
  }
`;
