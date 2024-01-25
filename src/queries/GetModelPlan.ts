import { gql } from '@apollo/client';

export default gql`
  query GetModelPlan($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      modifiedDts
      archived
      status
      basics {
        id
        clearanceStarts
        modifiedDts
        readyForClearanceDts
        status
      }
      collaborators {
        id
        userAccount {
          id
          commonName
          email
          username
        }
        userID
        teamRoles
        modelPlanID
        createdDts
      }
      documents {
        id
        fileName
      }
      crs {
        id
        idNumber
      }
      tdls {
        id
        idNumber
      }
      discussions {
        id
        content {
          rawContent
        }
        createdBy
        createdDts
        replies {
          id
          discussionID
          content {
            rawContent
          }
          createdBy
          createdDts
        }
      }
      generalCharacteristics {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        readyForClearanceDts
        status
      }
      participantsAndProviders {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        readyForClearanceDts
        status
      }
      beneficiaries {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        readyForClearanceDts
        status
      }
      opsEvalAndLearning {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        readyForClearanceDts
        status
      }
      payments {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        readyForClearanceDts
        status
      }
      operationalNeeds {
        id
        modifiedDts
      }
      prepareForClearance {
        status
        modifiedDts: latestClearanceDts
      }
    }
  }
`;
