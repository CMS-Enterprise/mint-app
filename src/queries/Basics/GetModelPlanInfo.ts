import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanInfo($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      basics {
        modelCategory
        cmsCenters
        cmsOther
        cmmiGroups
      }
    }
  }
`;
