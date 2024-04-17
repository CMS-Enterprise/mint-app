import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation DeleteDocumentSolutionLink(
    $solutionID: UUID!
    $documentIDs: [UUID!]!
  ) {
    removePlanDocumentSolutionLinks(
      solutionID: $solutionID
      documentIDs: $documentIDs
    )
  }
`);
