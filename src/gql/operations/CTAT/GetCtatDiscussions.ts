import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCtatDiscussions($ticketID: UUID!) {
    discussions(ticketID: $ticketID) {
      id
      ticketID
      content
      posterRole
      createdBy
      createdByUserAccount {
        givenName
        familyName
      }
      createdDts
    }
  }
`);
