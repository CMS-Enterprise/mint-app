import { gql } from '@apollo/client';

export default gql`
  mutation CreateModelPlanDocument($input: PlanDocumentInput!) {
    createPlanDocument(input: $input) {
      document {
        id
      }
      presignedURL
    }
  }
`;
