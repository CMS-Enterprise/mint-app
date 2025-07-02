import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateClearanceTimeline($id: UUID!, $changes: PlanTimelineChanges!) {
    updatePlanTimeline(id: $id, changes: $changes) {
      readyForClearanceByUserAccount {
        id
        commonName
      }
      readyForClearanceDts
      status
    }
  }
`);
