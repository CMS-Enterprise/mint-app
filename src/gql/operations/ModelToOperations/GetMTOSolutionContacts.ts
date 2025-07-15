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
      systemOwners {
        id
        ownerType
        cmsComponent
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
          userAccount {
            id
            username
          }
        }
      }
    }
  }
`);
