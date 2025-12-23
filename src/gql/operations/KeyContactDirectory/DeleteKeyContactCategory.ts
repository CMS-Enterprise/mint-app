import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation deleteKeyContactCategory($id: UUID!) {
    deleteKeyContactCategory(id: $id) {
      id
      name
      keyContacts {
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
  }
`);
