import { gql } from '@apollo/client';

export default gql`
  query GetModelCollaborator($id: UUID!) {
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
`;
