import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOSolutionContacts {
    mtoCommonSolutions {
      key
      contactInformation {
        pointsOfContact {
          id
          # name
          # email
          isTeam
          isPrimary
          role
        }
      }
    }
  }
`);
