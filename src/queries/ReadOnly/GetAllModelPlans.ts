import { gql } from '@apollo/client';

export default gql`
  query GetAllModelPlans($filter: ModelPlanFilter!) {
    modelPlanCollection(filter: $filter) {
      id
      modelName
      status
      abbreviation
      nameHistory(sort: DESC)
      isFavorite
      isCollaborator
      modifiedDts
      createdDts
      basics {
        demoCode
        amsModelID
        modelCategory
        clearanceStarts
        performancePeriodStarts
        modelCategory
        additionalModelCategories
        goal
      }
      discussions {
        id
        status
        replies {
          id
          resolution
        }
      }
      collaborators {
        userAccount {
          id
          commonName
          email
          username
        }
        userID
        teamRole
      }
      crTdls {
        id
        idNumber
      }
    }
  }
`;
