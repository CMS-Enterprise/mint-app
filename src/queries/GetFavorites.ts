import { gql } from '@apollo/client';

export default gql`
  query GetFavorites($filter: ModelPlanFilter!, $isMAC: Boolean!) {
    modelPlanCollection(filter: $filter) {
      id
      modelName
      isFavorite
      nameHistory(sort: DESC)
      isCollaborator
      status
      basics {
        id
        goal
        performancePeriodStarts
      }
      collaborators {
        id
        userAccount {
          id
          commonName
        }
        teamRoles
      }
      crTdls @include(if: $isMAC) {
        idNumber
      }
    }
  }
`;
