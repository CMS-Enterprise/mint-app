import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllKeyContacts {
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
`);
