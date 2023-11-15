import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
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
