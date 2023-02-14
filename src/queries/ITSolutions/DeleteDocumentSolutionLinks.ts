import { gql } from '@apollo/client';

export default gql`
  mutation DeleteDocumentSolutionLinks($id: UUID!) {
    removePlanDocumentSolutionLink(id: $id)
  }
`;
