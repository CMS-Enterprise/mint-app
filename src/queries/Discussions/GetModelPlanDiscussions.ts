import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanDiscussions($id: UUID!) {
    modelPlan(id: $id) {
      id
      isCollaborator
      collaborators {
        id
        euaUserID
        fullName
      }
      discussions {
        id
        content
        createdBy
        createdDts
        status
        isAssessment
        replies {
          id
          discussionID
          content
          isAssessment
          createdBy
          createdDts
          resolution
        }
      }
    }
  }
`;
