import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCtatRequestsAdmin {
    ctatRequestsAdmin {
      count
      ctatRequests {
        humanReadableID
        createdDts
        contractName
        typeOfHelpNeeded
        typeOfHelpNeededOther
        status
        assignedAdminUserAccount {
          username
        }
      }
    }
  }
`);
