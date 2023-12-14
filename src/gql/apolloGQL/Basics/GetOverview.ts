import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetOverview($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      basics {
        id
        modelType
        modelTypeOther
        problem
        goal
        testInterventions
        note
      }
    }
  }
`);
