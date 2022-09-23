import { gql } from '@apollo/client';

export default gql`
  mutation UploadNewPlanDocument($input: PlanDocumentInput!) {
    uploadNewPlanDocument(input: $input) {
      id
    }
  }
`;
