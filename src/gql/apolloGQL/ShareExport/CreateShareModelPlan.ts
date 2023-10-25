import { graphql } from '../../gen/gql';

export default graphql(/* GraphQL */ `
  mutation CreateShareModelPlan(
    $modelPlanID: UUID!
    $viewFilter: ModelViewFilter
    $usernames: [String!]!
    $optionalMessage: String
  ) {
    shareModelPlan(
      modelPlanID: $modelPlanID
      viewFilter: $viewFilter
      usernames: $usernames
      optionalMessage: $optionalMessage
    )
  }
`);
