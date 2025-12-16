import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation deleteKeyContact($id: UUID!) {
    deleteKeyContact(id: $id) {
      id
      name
      email
      mailboxTitle
      mailboxAddress
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
