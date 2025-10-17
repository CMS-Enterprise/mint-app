import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOCommonSolutionModelUsage {
    mtoCommonSolutions {
      key
      modelUsage {
        key
        modelPlanID
        modelPlan {
          id
          modelName
          status
        }
      }
    }
  }
`);
