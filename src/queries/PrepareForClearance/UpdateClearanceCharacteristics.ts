import { gql } from '@apollo/client';

export default gql`
  mutation UpdateClearanceCharacteristics(
    $id: UUID!
    $changes: PlanGeneralCharacteristicsChanges!
  ) {
    updatePlanGeneralCharacteristics(id: $id, changes: $changes) {
      readyForClearanceByUserAccount {
        commonName
      }
      readyForClearanceDts
      status
    }
  }
`;
