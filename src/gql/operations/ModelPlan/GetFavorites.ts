import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetFavorites($filter: ModelPlanFilter!) {
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
    }
  }
`);
