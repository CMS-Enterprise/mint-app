import { gql } from '@apollo/client';

export default gql`
  query GetModelPlans {
    modelPlanCollection {
      id
      modelName
      modelCategory
      cmmiGroups
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
