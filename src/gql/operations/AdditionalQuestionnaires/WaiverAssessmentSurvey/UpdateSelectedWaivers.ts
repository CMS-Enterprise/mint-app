import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateSelectedWaivers(
    $modelPlanID: UUID!
    $changes: [WaiverChanges!]!
  ) {
    updateSelectedWaivers(modelPlanID: $modelPlanID, changes: $changes) {
      id
    }
  }
`);
