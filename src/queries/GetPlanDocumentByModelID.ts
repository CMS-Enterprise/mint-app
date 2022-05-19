import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanDocumentByModelID($id: UUID!) {
    readPlanDocumentByModelID(id: $id) {
      id
      modelPlanID
      fileType
      bucket
      fileKey
      virusScanned
      virusClean
      fileName
      fileSize
      documentType
      otherType
      optionalNotes
      createdDts
    }
  }
`;
