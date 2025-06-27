import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelSummary($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      abbreviation
      createdDts
      modifiedDts
      mostRecentEdit {
        id
        date
      }
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
        id
        goal
      }
      generalCharacteristics {
        id
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
