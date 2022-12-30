import { gql } from '@apollo/client';

export default gql`
  query GetAllModelPlans($filter: ModelPlanFilter!) {
    modelPlanCollection(filter: $filter) {
      id
      modelName
      nameHistory(sort: DESC)
      status
      isFavorite
      isCollaborator
      basics {
        applicationsStart
        modelCategory
        goal
      }
      collaborators {
        fullName
        teamRole
      }
      crTdls {
        id
        idNumber
      }
    }
  }
`;
