import { graphql } from 'gql/gen/gql';

graphql(/* GraphQL */ `
  fragment BasicsOverviewFields on PlanBasics {
    id
    modelType
    problem
    goal
    testInterventions
    note
  }
`);

export default graphql(/* GraphQL */ `
  query GetBasics($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      basics {
        ...BasicsOverviewFields
      }
    }
  }
`);
