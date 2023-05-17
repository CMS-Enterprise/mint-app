import { gql } from '@apollo/client';

export default gql`
  mutation CreateDocumentSolutionLinks(
    $solutionID: UUID!
    $documentIDs: [UUID!]!
  ) {
    createPlanDocumentSolutionLinks(
      solutionID: $solutionID
      documentIDs: $documentIDs
    ) {
      id
    }
  }
`;
