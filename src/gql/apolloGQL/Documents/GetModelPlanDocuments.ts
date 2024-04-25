import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelPlanDocuments($id: UUID!) {
    modelPlan(id: $id) {
      id
      isCollaborator
      documents {
        id
        virusScanned
        virusClean
        fileName
        fileType
        downloadUrl
        restricted
        documentType
        createdDts
        optionalNotes
        otherType
        numLinkedSolutions
        isLink
        url
      }
    }
  }
`);
