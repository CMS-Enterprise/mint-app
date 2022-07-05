import { gql } from '@apollo/client';

export default gql`
  mutation UpdatePlanMilestones($id: UUID!, $changes: PlanMilestoneChanges!) {
    updatePlanMilestones(id: $id, changes: $changes) {
      id
    }
  }
`;
