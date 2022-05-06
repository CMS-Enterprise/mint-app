import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlan($input: ModelPlanInput!) {
    updateModelPlan(input: $input) {
      id
      modelName
      modelCategory
      cmsCenters
      cmsOther
      cmmiGroups
      archived
      status
    }
  }
`;
