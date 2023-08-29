import { graphql } from '../../gen/gql';

export default graphql(/* GraphQL */ `
  mutation CreateShareModelPlan(
    $modelPlanID: UUID!
    $viewFilter: ModelViewFilter
    $receiverEmails: [String!]!
    $optionalMessage: String
  ) {
    shareModelPlan(
      modelPlanID: $modelPlanID
      viewFilter: $viewFilter
      receiverEmails: $receiverEmails
      optionalMessage: $optionalMessage
    )
  }
`);
