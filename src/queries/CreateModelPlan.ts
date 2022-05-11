import { gql } from '@apollo/client';

export default gql`
  mutation CreateModelPlan($modelName: String!) {
    createModelPlan(modelName: $modelName) {
      id
      createdBy
    }
  }
`;
