import { graphql } from 'gql';

export default graphql(/* GraphQL */ `
  query GetNDA {
    ndaInfo {
      agreed
      agreedDts
    }
  }
`);
