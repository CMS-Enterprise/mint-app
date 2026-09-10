import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation AdminUpdateCtatRequest($id: UUID!, $changes: CTATAdminUpdateInput!) {
    adminUpdateCTATRequest(id: $id, changes: $changes) {
      id
      humanReadableID
      status
      notes
      resolution
      assignedAdminUserAccount {
        username
        commonName
        email
        givenName
        familyName
      }
    }
  }
`);
