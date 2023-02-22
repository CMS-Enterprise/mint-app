import { gql } from '@apollo/client';

export default gql`
  query GetModelSummary($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      modifiedDts
      status
      isFavorite
      basics {
        goal
        applicationsStart
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
        teamRole
      }
      crTdls {
        idNumber
      }
    }
  }
`;
