import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlanCharacteristics(
    $id: UUID!
    $changes: PlanGeneralCharacteristicsChanges!
  ) {
    updatePlanGeneralCharacteristics(id: $id, changes: $changes) {
      id
    }
  }
`;
