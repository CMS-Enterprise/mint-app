import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanInfo($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      abbreviation
      nameHistory(sort: DESC)
      basics {
        id
        demoCode
        amsModelID
        modelCategory
        additionalModelCategories
        cmsCenters
        cmsOther
        cmmiGroups
      }
    }
  }
`;
