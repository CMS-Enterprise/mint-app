import { gql } from '@apollo/client';

export default gql`
  mutation UpdateClearanceBasics($id: UUID!, $changes: PlanBasicsChanges!) {
    updatePlanBasics(id: $id, changes: $changes) {
      readyForClearanceByUserAccount {
        commonName
      }
      readyForClearanceDts
      status
    }
  }
`;
