import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation CreateShareModelPlan(
    $modelPlanID: UUID!
    $viewFilter: ModelViewFilter
    $modelShareSection: ModelShareSection
    $usernames: [String!]!
    $optionalMessage: String
  ) {
    shareModelPlan(
      modelPlanID: $modelPlanID
      viewFilter: $viewFilter
      modelShareSection: $modelShareSection
      usernames: $usernames
      optionalMessage: $optionalMessage
    )
  }
`);
