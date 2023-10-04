import { gql } from '@apollo/client';

export default gql`
  mutation LinkNewPlanDocument($input: PlanDocumentLinkInput!) {
    linkNewPlanDocument(input: $input) {
      id
    }
  }
`;
