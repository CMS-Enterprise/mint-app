import { gql } from '@apollo/client';

export default gql`
  mutation UpdateClearanceParticipantsAndProviders(
    $id: UUID!
    $changes: PlanParticipantsAndProvidersChanges!
  ) {
    updatePlanParticipantsAndProviders(id: $id, changes: $changes) {
      readyForClearanceByUserAccount {
        id
        commonName
      }
      readyForClearanceDts
      status
    }
  }
`;
