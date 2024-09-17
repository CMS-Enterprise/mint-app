import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateCR($id: UUID!, $changes: PlanCRChanges!) {
    updatePlanCR(id: $id, changes: $changes) {
      id
      modelPlanID
      idNumber
      dateInitiated
      dateImplemented
      title
      note
    }
  }
`);
