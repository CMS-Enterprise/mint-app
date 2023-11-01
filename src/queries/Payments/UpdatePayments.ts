import { gql } from '@apollo/client';

export default gql`
  mutation UpdatePaymentsOLD($id: UUID!, $changes: PlanPaymentsChanges!) {
    updatePlanPayments(id: $id, changes: $changes) {
      id
    }
  }
`;
