import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelPlansByStatus($status: ModelPlanStatus!) {
    modelPlansByStatus(status: $status) {
      status
      modelPlanID
      modelPlan {
        id
        modelName
        status
        abbreviation
        nameHistory(sort: DESC)
        createdDts
        mostRecentEdit {
          id
          date
        }
        basics {
          id
          amsModelID
          modelCategory
          additionalModelCategories
        }
        timeline {
          id
          clearanceStarts
          performancePeriodStarts
          performancePeriodEnds
        }
      }
    }
  }
`);
