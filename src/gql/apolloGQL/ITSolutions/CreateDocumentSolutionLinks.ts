import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
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
`);
