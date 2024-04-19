import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetOperationalSolution($id: UUID!) {
    operationalSolution(id: $id) {
      id
      key
      needed
      name
      nameOther
      pocName
      pocEmail
      status
      isOther
      isCommonSolution
      otherHeader
      mustFinishDts
      mustStartDts
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
      operationalSolutionSubtasks {
        id
        name
        status
      }
    }
  }
`);
