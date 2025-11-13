import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelPlansByStatusGroup($statusGroup: ModelPlanStatusGroup!) {
    modelPlansByStatusGroup(statusGroup: $statusGroup) {
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
      discussions {
        id
        replies {
          id
        }
      }
      payments {
        id
        paymentStartDate
      }
    }
  }
`);
