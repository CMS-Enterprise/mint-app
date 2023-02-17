import { gql } from '@apollo/client';

export default gql`
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
      }
    }
  }
`;
