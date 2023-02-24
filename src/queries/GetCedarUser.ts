import { gql } from '@apollo/client';

export default gql`
  query GetCedarUser($commonName: String!) {
    cedarPersonsByCommonName(commonName: $commonName) {
      email
      commonName: displayName
      euaUserId: username
    }
  }
`;
