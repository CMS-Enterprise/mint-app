import { graphql } from '../gen/gql';

export default graphql(/* GraphQL */ `
  query GetNDA {
    ndaInfo {
      agreed
      agreedDts
    }
  }
`);
