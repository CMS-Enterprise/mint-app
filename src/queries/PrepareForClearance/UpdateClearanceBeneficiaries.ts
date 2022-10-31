import { gql } from '@apollo/client';

export default gql`
  mutation UpdateClearanceBeneficiaries(
    $id: UUID!
    $changes: PlanBeneficiariesChanges!
  ) {
    updatePlanBeneficiaries(id: $id, changes: $changes) {
      readyForClearanceBy
      readyForClearanceDts
      status
    }
  }
`;
