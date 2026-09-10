import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateCTATRequest($input: CTATRequestInput!) {
    createCTATRequest(input: $input) {
      id
      humanReadableID
      createdDts
    }
  }
`);
