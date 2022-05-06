import { gql } from '@apollo/client';

export default gql`
  query GetModelPlan($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      modelCategory
      cmsCenters
      cmsOther
      cmmiGroups
      archived
      status
      basics {
        id
      }
    }
  }
`;
