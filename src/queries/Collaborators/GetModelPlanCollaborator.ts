import { gql } from '@apollo/client';

export default gql`
  query GetModelCollaborator($id: UUID!) {
    planCollaboratorByID(id: $id) {
      id
      userAccount {
        commonName
        email
        username
      }
      userID
      teamRole
    }
  }
`;
