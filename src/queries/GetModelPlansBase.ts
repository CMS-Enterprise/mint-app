import { gql } from '@apollo/client';

export default gql`
  query GetModelPlansBase($filter: ModelPlanFilter!) {
    modelPlanCollection(filter: $filter) {
      id
      modelName
    }
  }
`;
