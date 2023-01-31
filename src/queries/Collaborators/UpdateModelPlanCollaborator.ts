import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlanCollaborator($id: UUID!, $newRole: TeamRole!) {
    updatePlanCollaborator(id: $id, newRole: $newRole) {
      teamRole
      userAccount {
        commonName
        email
        username
      }
      userID
      modelPlanID
    }
  }
`;
