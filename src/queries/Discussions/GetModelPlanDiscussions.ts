import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanDiscussions($id: UUID!) {
    modelPlan(id: $id) {
      id
      discussions {
        id
        content
        createdBy
        createdDts
        status
        replies {
          id
          discussionID
          content
          createdBy
          createdDts
          resolution
        }
      }
    }
  }
`;
