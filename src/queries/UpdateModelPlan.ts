import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlan($id: UUID!, $changes: ModelPlanChanges!) {
    updateModelPlan(id: $id, changes: $changes) {
      id
      modelName
      # modelCategory # TODO: GARY
      # cmsCenters # TODO: GARY
      # cmmiGroups # TODO: GARY
      # cmsOther # TODO: GARY
      createdBy
      modifiedBy
      modifiedDts
      archived
      status
    }
  }
`;
