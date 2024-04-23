import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateNDA {
    agreeToNDA(agree: true) {
      agreed
      agreedDts
    }
  }
`);
