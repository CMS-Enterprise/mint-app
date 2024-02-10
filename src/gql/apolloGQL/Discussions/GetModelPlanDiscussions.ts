import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelPlanDiscussions($id: UUID!) {
    modelPlan(id: $id) {
      id
      isCollaborator
      discussions {
        id
        content {
          rawContent
        }
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
          content {
            rawContent
          }
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
`);
