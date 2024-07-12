import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelsBySolution($operationalSolutionKey: OperationalSolutionKey!) {
    modelPlansByOperationalSolutionKey(
      operationalSolutionKey: $operationalSolutionKey
    ) {
      modelPlan {
        id
        modelName
        status
        basics {
          id
          modelCategory
          applicationsStart
          applicationsEnd
        }
      }
    }
  }
`);
