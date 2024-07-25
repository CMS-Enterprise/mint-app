import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelsBySolution($operationalSolutionKey: OperationalSolutionKey!) {
    modelPlansByOperationalSolutionKey(
      operationalSolutionKey: $operationalSolutionKey
    ) {
      modelPlan {
        id
        modelName
        abbreviation
        status
        modelBySolutionStatus
        basics {
          id
          modelCategory
          performancePeriodStarts
          performancePeriodEnds
        }
      }
    }
  }
`);
