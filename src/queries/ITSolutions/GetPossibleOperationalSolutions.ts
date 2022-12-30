import { gql } from '@apollo/client';

export default gql`
  query GetPossibleOperationalSolutions {
    possibleOperationalSolutions {
      id
      name
      key
    }
  }
`;
