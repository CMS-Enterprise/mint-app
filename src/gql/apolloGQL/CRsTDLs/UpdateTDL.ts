import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateTDL($id: UUID!, $changes: PlanTDLChanges!) {
    updatePlanTDL(id: $id, changes: $changes) {
      id
      modelPlanID
      idNumber
      dateInitiated
      title
      note
    }
  }
`);
