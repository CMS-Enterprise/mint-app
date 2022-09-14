import { gql } from '@apollo/client';

export default gql`
  query GetNDA {
    ndaInfo {
      agreed
      agreedDts
    }
  }
`;
