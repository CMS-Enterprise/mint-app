import { gql } from '@apollo/client';

export default gql`
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
`;
