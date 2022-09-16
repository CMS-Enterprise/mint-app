import { gql } from '@apollo/client';

export default gql`
  mutation UploadNewPlanDocument($input: PlanDocumentBEInput!) {
    uploadNewPlanDocument(input: $input) {
      id
    }
  }
`;
