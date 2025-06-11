import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOSolutionContacts {
    mtoCommonSolutions {
      key
      contactInformation {
        pointsOfContact {
          id
          name
          email
          mailboxTitle
          mailboxAddress
          isTeam
          isPrimary
          role
          receiveEmails
        }
      }
    }
  }
`);
