import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCTATRequestsRequester {
    ctatRequestsRequester {
      ctatRequests {
        id
        humanReadableID
        createdDts
        contractName
        typeOfHelpNeeded
        status
        assignedAdmin
      }
    }
  }
`);
