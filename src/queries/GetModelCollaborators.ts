import { gql } from '@apollo/client';

export default gql`
  query GetModelCollaborators($id: UUID!) {
    modelPlan(id: $id) {
      collaborators {
        id
        fullName
        euaUserID
        teamRole
        createdDts
      }
    }
  }
`;
