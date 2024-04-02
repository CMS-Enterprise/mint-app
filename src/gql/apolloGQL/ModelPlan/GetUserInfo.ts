import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetUserInfo($username: String!) {
    userAccount(username: $username) {
      id
      username
      commonName
      email
      givenName
      familyName
    }
  }
`);
