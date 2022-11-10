import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanDocument($id: UUID!) {
    planDocument(id: $id) {
      id
      modelPlanID
      fileType
      bucket
      fileKey
      virusScanned
      virusClean
      fileName
      fileSize
      restricted
      documentType
      otherType
      createdDts
    }
  }
`;
