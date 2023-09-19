import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanDiscussions($id: UUID!) {
    modelPlan(id: $id) {
      id
      isCollaborator
      discussions {
        id
        content
        createdBy
        createdDts
        userRole
        userRoleDescription
        isAssessment
        createdByUserAccount {
          commonName
        }
        replies {
          id
          discussionID
          content
          userRole
          userRoleDescription
          isAssessment
          createdBy
          createdDts
          createdByUserAccount {
            commonName
          }
        }
      }
    }
  }
`;
