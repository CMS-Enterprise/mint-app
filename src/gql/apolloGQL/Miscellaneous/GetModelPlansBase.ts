import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetModelPlansBase($filter: ModelPlanFilter!) {
    modelPlanCollection(filter: $filter) {
      id
      modelName
    }
  }
`);
