import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetIndividualKeyContact($id: UUID!) {
    keyContact(id: $id) {
      id
      name
      email
      subjectArea
      subjectCategoryID
      userAccount {
        id
        commonName
        email
        username
      }
    }
  }
`);
