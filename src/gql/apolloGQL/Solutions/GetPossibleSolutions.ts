import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetPossibleSolutions {
    possibleOperationalSolutions {
      id
      key
      pointsOfContact {
        id
        name
        email
        isTeam
        isPrimary
        role
      }
    }
  }
`);
