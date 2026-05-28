import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCtatRequestsRequester {
    ctatRequestsRequester {
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
