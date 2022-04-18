import { gql } from '@apollo/client';

export default gql`
  mutation createModelPlan($input: ModelPlanInput!) {
    createModelPlan(input: $input) {
      id
    }
  }
`;
