import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOSolutionContacts {
    mtoCommonSolutions {
      key
      contactInformation {
        pointsOfContact {
          id
          mailboxTitle
          mailboxAddress
          userAccount {
            id
            givenName
            familyName
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
