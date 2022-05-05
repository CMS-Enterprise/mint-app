import { gql } from '@apollo/client';

export default gql`
  mutation CreateModelPlan($input: ModelPlanInput!) {
    createModelPlan(input: $input) {
      id
      createdBy
    }
  }
`;
