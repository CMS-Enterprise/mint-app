import { gql } from '@apollo/client';

export default gql`
  query GetAllModelPlans {
    modelPlanCollection {
      id
      modelName
      status
      isFavorite
      basics {
        applicationsStart
        modelCategory
        goal
      }
      collaborators {
        fullName
        teamRole
      }
    }
  }
`;
