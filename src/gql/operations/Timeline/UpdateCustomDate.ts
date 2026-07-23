import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateCustomDate($id: UUID!, $changes: CustomTimelineDateChanges!) {
    updateCustomTimelineDate(id: $id, changes: $changes) {
      id
    }
  }
`);
