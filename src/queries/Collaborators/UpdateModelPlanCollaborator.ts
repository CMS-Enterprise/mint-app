import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlanCollaborator($id: UUID!, $newRole: TeamRole!) {
    updatePlanCollaborator(id: $id, newRole: $newRole) {
      fullName
      teamRole
      euaUserID
      modelPlanID
    }
  }
`;
