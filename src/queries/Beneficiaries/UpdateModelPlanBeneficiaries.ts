import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlanBeneficiaries(
    $id: UUID!
    $changes: PlanBeneficiariesChanges!
  ) {
    updatePlanBeneficiaries(id: $id, changes: $changes) {
      id
    }
  }
`;
