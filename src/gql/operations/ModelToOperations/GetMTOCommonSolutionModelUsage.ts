import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetMTOCommonSolutionModelUsage {
    mtoCommonSolutions {
      key
      modelUsage {
        id
        key
        modelName
        modelStatus
        modelId
      }
    }
  }
`);
