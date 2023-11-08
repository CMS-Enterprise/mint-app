import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetNDA {
    ndaInfo {
      agreed
      agreedDts
    }
  }
`);
