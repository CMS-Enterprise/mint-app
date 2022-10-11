import { gql } from '@apollo/client';

export default gql`
  query GetModelCollaborators($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      collaborators {
        id
        fullName
        euaUserID
        email
        teamRole
        modelPlanID
        createdDts
      }
    }
  }
`;
