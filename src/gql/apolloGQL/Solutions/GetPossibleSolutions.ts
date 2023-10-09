import { graphql } from '../../gen/gql';

export default graphql(/* GraphQL */ `
  query GetPossibleSolutions {
    possibleOperationalSolutions {
      id
      key
      pointsOfContact {
        id
        name
        email
        isTeam
        role
      }
    }
  }
`);
