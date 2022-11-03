import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanInfo($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      nameHistory(sort: DESC)
      basics {
        id
        modelCategory
        cmsCenters
        cmsOther
        cmmiGroups
      }
    }
  }
`;
