import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetFavoriteAnalytics($filter: ModelPlanFilter!) {
    modelPlanCollection(filter: $filter) {
      id
      modelName
    }
  }
`);
