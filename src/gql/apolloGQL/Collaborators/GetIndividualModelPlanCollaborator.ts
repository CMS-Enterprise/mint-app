import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetIndividualModelPlanCollaborator($id: UUID!) {
    planCollaboratorByID(id: $id) {
      id
      userAccount {
        id
        commonName
        email
        username
      }
      userID
      teamRoles
    }
  }
`);
