import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllKeyContacts {
    keyContacts {
      id
      name
      email
      subjectArea
      subjectCategoryID
    }
  }
`);
