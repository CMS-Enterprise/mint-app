import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlan($input: ModelPlanInput!) {
    updateModelPlan(input: $input) {
      id
      createdBy
    }
  }
`;
