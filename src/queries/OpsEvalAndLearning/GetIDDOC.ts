import { gql } from '@apollo/client';

export default gql`
  query GetIDDOC($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
        dataNeededForMonitoring
        iddocSupport
        technicalContactsIdentified
        technicalContactsIdentifiedDetail
        technicalContactsIdentifiedNote
        captureParticipantInfo
        captureParticipantInfoNote
        icdOwner
        draftIcdDueDate
        icdNote
      }
    }
  }
`;
