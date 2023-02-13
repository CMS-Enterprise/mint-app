import { gql } from '@apollo/client';

export default gql`
  mutation UpdateClearancePayments($id: UUID!, $changes: PlanPaymentsChanges!) {
    updatePlanPayments(id: $id, changes: $changes) {
      readyForClearanceByUserAccount {
        commonName
      }
      readyForClearanceDts
      status
    }
  }
`;
