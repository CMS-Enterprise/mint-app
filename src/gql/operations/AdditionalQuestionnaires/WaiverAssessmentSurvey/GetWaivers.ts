import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetWaivers($id: UUID!) {
    modelPlan(id: $id) {
      id
      waiverInfo {
        commonWaivers {
          id
          waiverType
          name
          isSuggested
          isAnswered
          willUseWaiver
          notUsingReason
          usingReason
        }
      }
    }
  }
`);
