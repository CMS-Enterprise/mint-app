import { gql } from '@apollo/client';

export default gql`
  mutation UpdateDraftModelPlan($input: ModelPlanInput!) {
    updateModelPlan(input: $input) {
      id
      createdBy
    }
  }
`;
