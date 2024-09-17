import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation LinkNewPlanDocument($input: PlanDocumentLinkInput!) {
    linkNewPlanDocument(input: $input) {
      id
    }
  }
`);
