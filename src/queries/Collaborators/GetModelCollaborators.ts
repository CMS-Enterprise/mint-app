import { gql } from '@apollo/client';

export default gql`
  query GetModelCollaborators($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      collaborators {
        id
        userAccount {
          id
          commonName
          email
          username
        }
        userID
        teamRoles
        modelPlanID
        createdDts
      }
    }
  }
`;
