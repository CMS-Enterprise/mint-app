import { gql } from '@apollo/client';

export default gql`
  mutation UpdatePlanGeneralCharacteristics(
    $id: UUID!
    $changes: PlanGeneralCharacteristicsChanges!
  ) {
    updatePlanGeneralCharacteristics(id: $id, changes: $changes) {
      id
    }
  }
`;
