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
      documents {
        id
        fileName
      }
      crTdls {
        id
        idNumber
      }
      discussions {
        id
        content
        createdBy
        createdDts
        status
        replies {
          id
          discussionID
          content
          createdBy
          createdDts
          resolution
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
      itTools {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        status
      }
      prepareForClearance {
        status
        modifiedDts: latestClearanceDts
      }
    }
  }
`;
