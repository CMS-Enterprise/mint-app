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
      crs {
        id
        idNumber
      }
      tdls {
        id
        idNumber
      }
    }
  }
`);
