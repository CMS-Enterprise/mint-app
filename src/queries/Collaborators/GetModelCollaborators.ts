import { gql } from '@apollo/client';

export default gql`
  query GetModelCollaborators($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      collaborators {
        id
        userAccount {
          commonName
          email
          username
        }
        userID
        teamRole
        modelPlanID
        createdDts
      }
    }
  }
`;
