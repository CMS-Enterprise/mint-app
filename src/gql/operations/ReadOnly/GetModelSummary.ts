import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelSummary($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      abbreviation
      createdDts
      modifiedDts
      status
      isFavorite
      echimpCRsAndTDLs {
        ... on EChimpCR {
          id
        }
        ... on EChimpTDL {
          id
        }
      }
      basics {
        goal
        performancePeriodStarts
      }
      generalCharacteristics {
        keyCharacteristics
      }
      isCollaborator
      collaborators {
        userAccount {
          id
          commonName
          email
          username
        }
        teamRoles
      }
    }
  }
`);
