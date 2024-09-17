import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetPossibleOperationalSolutions {
    possibleOperationalSolutions {
      id
      name
      key
    }
  }
`);
