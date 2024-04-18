import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateClearanceBasics($id: UUID!, $changes: PlanBasicsChanges!) {
    updatePlanBasics(id: $id, changes: $changes) {
      readyForClearanceByUserAccount {
        id
        commonName
      }
      readyForClearanceDts
      status
    }
  }
`);
