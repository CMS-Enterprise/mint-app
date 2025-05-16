import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelsByMTOSolution($solutionKey: MTOCommonSolutionKey!) {
    modelPlansByMTOSolutionKey(solutionKey: $solutionKey) {
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
          performancePeriodStarts
          performancePeriodEnds
        }
      }
    }
  }
`);
