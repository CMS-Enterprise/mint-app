import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanDocuments($id: UUID!) {
    modelPlan(id: $id) {
      id
      documents {
        id
        virusScanned
        virusClean
        fileName
        fileType
        downloadUrl
        documentType
        createdDts
        optionalNotes
      }
    }
  }
`;
