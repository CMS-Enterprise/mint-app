import { gql } from '@apollo/client';

export default gql`
  mutation DeleteDocumentSolutionLink(
    $solutionID: UUID!
    $documentIDs: [UUID!]!
  ) {
    removePlanDocumentSolutionLinks(
      solutionID: $solutionID
      documentIDs: $documentIDs
    )
  }
`;
