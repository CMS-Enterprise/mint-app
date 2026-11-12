import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateCtatDiscussion($input: CTATDiscussionInput!) {
    createDiscussion(input: $input) {
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
