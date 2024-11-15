import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelToOperationsCategories {
    modelPlan(id: "{{modelPlanID}}") {
      mtoMatrix {
        categories {
          id
          name
        }
      }
    }
  }
`);
