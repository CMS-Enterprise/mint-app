import { gql } from '@apollo/client';

export default gql`
  mutation UpdatePlanParticipantsAndProviders(
    $id: UUID!
    $changes: PlanParticipantsAndProvidersChanges!
  ) {
    updatePlanParticipantsAndProviders(id: $id, changes: $changes) {
      id
    }
  }
`;
