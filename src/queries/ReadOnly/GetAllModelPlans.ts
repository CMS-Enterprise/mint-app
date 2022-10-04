import { gql } from '@apollo/client';

export default gql`
  query GetAllModelPlans {
    modelPlanCollection(includeAll: true) {
      id
      modelName
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
