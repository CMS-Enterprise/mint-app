import { gql } from '@apollo/client';

export default gql`
  query GetModelPlans($includeAll: Boolean!) {
    modelPlanCollection(includeAll: $includeAll) {
      id
      modelName
      status
      createdBy
      createdDts
      modifiedDts
      collaborators {
        id
        fullName
        teamRole
      }
      discussions {
        status
        replies {
          resolution
        }
      }
    }
  }
`;
