import { graphql } from '../../gen/gql';

export default graphql(/* GraphQL */ `
  query GetOverview($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      basics {
        id
        modelType
        problem
        goal
        testInterventions
        note
      }
    }
  }
`);
