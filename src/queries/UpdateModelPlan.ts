import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlan($input: ModelPlanInput!) {
    updateModelPlan(input: $input) {
      id
      modelName
      modelCategory
      cmsCenter
      cmmiGroups
      modifiedBy
      modifiedDts
      status
    }
  }
`;
