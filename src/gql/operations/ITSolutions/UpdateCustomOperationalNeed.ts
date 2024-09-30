import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateCustomOperationalNeed(
    $modelPlanID: UUID!
    $customNeedType: String!
    $needed: Boolean!
  ) {
    addOrUpdateCustomOperationalNeed(
      modelPlanID: $modelPlanID
      customNeedType: $customNeedType
      needed: $needed
    ) {
      id
      nameOther
      needed
      key
    }
  }
`);
