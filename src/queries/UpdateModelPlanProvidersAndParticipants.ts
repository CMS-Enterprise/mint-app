import { gql } from '@apollo/client';

export default gql`
  mutation UpdateModelPlanProvidersAndParticipants(
    $id: UUID!
    $changes: PlanParticipantsAndProvidersChanges!
  ) {
    updatePlanParticipantsAndProviders(id: $id, changes: $changes) {
      id
    }
  }
`;
