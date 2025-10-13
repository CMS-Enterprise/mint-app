import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelPlansByComponentGroup($key: ComponentGroup!) {
    modelPlansByComponentGroup(key: $key) {
      key
      modelPlanID
      modelPlan {
        id
        modelName
        abbreviation
        status
        modelBySolutionStatus
        basics {
          id
          modelCategory
        }
        timeline {
          id
          performancePeriodStarts
          performancePeriodEnds
        }
      }
    }
  }
`);
