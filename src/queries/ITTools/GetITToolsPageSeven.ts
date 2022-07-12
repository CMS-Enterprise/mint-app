import { gql } from '@apollo/client';

export default gql`
  query GetITToolPageSeven($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        dataToSendParticicipants
        modelLearningSystems
      }
      itTools {
        id
        oelSendReports
        oelSendReportsOther
        oelSendReportsNote
        oelLearningContractor
        oelLearningContractorOther
        oelLearningContractorNote
        oelParticipantCollaboration
        oelParticipantCollaborationOther
        oelParticipantCollaborationNote
      }
    }
  }
`;
