import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation createKeyContactCategory($name: String!) {
    createKeyContactCategory(name: $name) {
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
