import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateDataExchangeApproach(
    $id: UUID!
    $changes: PlanDataExchangeApproachChanges!
  ) {
    updatePlanDataExchangeApproach(id: $id, changes: $changes) {
      id
    }
  }
`);
