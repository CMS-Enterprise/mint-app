import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UploadNewPlanDocument($input: PlanDocumentInput!) {
    uploadNewPlanDocument(input: $input) {
      id
    }
  }
`);
