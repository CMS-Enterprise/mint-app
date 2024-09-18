import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  mutation UpdateModelPlanBeneficiaries(
    $id: UUID!
    $changes: PlanBeneficiariesChanges!
  ) {
    updatePlanBeneficiaries(id: $id, changes: $changes) {
      id
    }
  }
`);
