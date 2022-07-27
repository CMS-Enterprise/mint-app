import { gql } from '@apollo/client';

export default gql`
  query GetModelPlanInfo($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      # modelCategory # TODO: GARY
      # cmsCenters # TODO: GARY
      # cmsOther # TODO: GARY
      # cmmiGroups # TODO: GARY
    }
  }
`;
