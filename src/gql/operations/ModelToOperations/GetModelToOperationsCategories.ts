import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query ModelPlanMTOCategories {
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
