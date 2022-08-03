import { gql } from '@apollo/client';

export default gql`
  query GetITToolPageThree($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      participantsAndProviders {
        id
        communicationMethod
      }
      itTools {
        id
        ppCommunicateWithParticipant
        ppCommunicateWithParticipantOther
        ppCommunicateWithParticipantNote
        ppManageProviderOverlap
        ppManageProviderOverlapOther
        ppManageProviderOverlapNote
        bManageBeneficiaryOverlap
        bManageBeneficiaryOverlapOther
        bManageBeneficiaryOverlapNote
      }
    }
  }
`;
