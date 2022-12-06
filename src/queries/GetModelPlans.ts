import { gql } from '@apollo/client';

export default gql`
  query GetModelPlans($filter: ModelPlanFilter!) {
    modelPlanCollection(filter: $filter) {
      id
      modelName
      status
      nameHistory(sort: DESC)
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
