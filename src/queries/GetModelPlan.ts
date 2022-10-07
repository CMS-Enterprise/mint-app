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
        modifiedDts
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
        status
      }
      participantsAndProviders {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        status
      }
      beneficiaries {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        status
      }
      opsEvalAndLearning {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
        status
      }
      payments {
        id
        createdBy
        createdDts
        modifiedBy
        modifiedDts
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
    }
  }
`;
