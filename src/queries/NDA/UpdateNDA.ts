import { gql } from '@apollo/client';

export default gql`
  mutation UpdateNDA {
    agreeToNDA(agree: true) {
      agreed
      agreedDts
    }
  }
`;
