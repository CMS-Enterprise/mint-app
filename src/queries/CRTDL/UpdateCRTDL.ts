import { gql } from '@apollo/client';

export default gql`
  mutation UpdateCRTDL($id: UUID!, $changes: PlanCrTdlChanges!) {
    updatePlanCrTdl(id: $id, changes: $changes) {
      id
    }
  }
`;
