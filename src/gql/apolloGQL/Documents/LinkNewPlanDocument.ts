import { graphql } from '../../gen/gql';

export default graphql(/* GraphQL */ `
  mutation LinkNewPlanDocument($input: PlanDocumentLinkInput!) {
    linkNewPlanDocument(input: $input) {
      id
    }
  }
`);
