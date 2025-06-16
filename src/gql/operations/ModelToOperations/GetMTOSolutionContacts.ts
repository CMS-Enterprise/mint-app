import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOSolutionContacts {
    mtoCommonSolutions {
      key
      contractors {
        id
        contractorTitle
        contractorName
      }
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
