import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOSolutionContacts {
    mtoCommonSolutions {
      key
      contactInformation {
        pointsOfContact {
          id
          userAccount {
            id
            givenName
            email
          }
          isTeam
          isPrimary
          role
          receiveEmails
        }
      }
    }
  }
`);
