import { gql } from '@apollo/client';

export default gql`
  query GetPlanDocumentDownloadURL($id: UUID!) {
    planDocumentDownloadURL(id: $id) {
      document {
        id
      }
      presignedURL
    }
  }
`;
