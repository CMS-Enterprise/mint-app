import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTimeline($id: UUID!, $changes: PlanTimelineChanges!) {
    updatePlanTimeline(id: $id, changes: $changes) {
      id
    }
  }
`);
