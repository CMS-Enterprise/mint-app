import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCtatRequestsAdmin {
    ctatRequests {
      count
      ctatRequests {
        id
        humanReadableID
        createdDts
        contractName
        cmmiGroup
        typeOfHelpNeeded
        typeOfHelpNeededOther
        status
        assignedAdminUserAccount {
          username
          givenName
          familyName
        }
      }
    }
  }
`);
