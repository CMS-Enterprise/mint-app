import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
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
`);
