import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateModelPlanCollaborator($id: UUID!, $newRole: [TeamRole!]!) {
    updatePlanCollaborator(id: $id, newRoles: $newRole) {
      teamRoles
      userAccount {
        commonName
        email
        username
      }
      userID
      modelPlanID
    }
  }
`);
