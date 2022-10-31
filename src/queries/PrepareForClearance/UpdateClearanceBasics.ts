import { gql } from '@apollo/client';

export default gql`
  mutation UpdateClearanceBasics($id: UUID!, $changes: PlanBasicsChanges!) {
    updatePlanBasics(id: $id, changes: $changes) {
      readyForClearanceBy
      readyForClearanceDts
      status
    }
  }
`;
