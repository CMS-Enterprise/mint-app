import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateCustomDate($input: CustomTimelineDateCreateInput!) {
    createCustomTimelineDate(input: $input) {
      id
    }
  }
`);
