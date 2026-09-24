import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateSelectedWaivers(
    $modelPlanID: UUID!
    $changes: [WaiverSelectionInput!]!
  ) {
    updateSelectedWaivers(modelPlanID: $modelPlanID, changes: $changes) {
      id
    }
  }
`);
