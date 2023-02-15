import { gql } from '@apollo/client';

export default gql`
  mutation DeleteDocumentSolutionLink($id: UUID!) {
    removePlanDocumentSolutionLink(id: $id)
  }
`;
