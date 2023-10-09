import { gql } from '@apollo/client';

export default gql`
  mutation DeleteModelPlanCollaborator($id: UUID!) {
    deletePlanCollaborator(id: $id) {
      id
      teamRoles
      userAccount {
        id
        commonName
        email
        username
      }
      userID
      modelPlanID
    }
  }
`;
