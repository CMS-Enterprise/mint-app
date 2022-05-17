import { gql } from '@apollo/client';

export default gql`
  query GetModelPlan($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      modelCategory
      cmsCenters
      cmsOther
      cmmiGroups
      archived
      status
      basics {
        id
      }
      discussions {
        id
        content
        status
        createdBy
        createdDts
        replies {
          id
          content
          discussionID
          resolution
          createdBy
          createdDts
        }
      }
    }
  }
`;
