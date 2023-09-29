import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlanDiscussion(
    $id: UUID!
    $changes: PlanDiscussionChanges!
  ) {
    updatePlanDiscussion(id: $id, changes: $changes) {
      id
    }
  }
`;
