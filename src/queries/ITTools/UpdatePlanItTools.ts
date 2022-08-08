import { gql } from '@apollo/client';

export default gql`
  mutation UpdatePlanItTools($id: UUID!, $changes: PlanITToolsChanges!) {
    updatePlanItTools(id: $id, changes: $changes) {
      id
    }
  }
`;
