import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
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
      echimpCRsAndTDLs {
        ... on EChimpCR {
          id
        }
        ... on EChimpTDL {
          id
        }
      }
      crs @include(if: $isMAC) {
        idNumber
      }
      tdls @include(if: $isMAC) {
        idNumber
      }
    }
  }
`);
