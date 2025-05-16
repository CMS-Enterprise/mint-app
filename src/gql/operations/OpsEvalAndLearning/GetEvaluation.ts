import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetEvaluation($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
        dataNeededForMonitoring
        iddocSupport
        evaluationApproaches
        evaluationApproachOther
        evalutaionApproachNote
        ccmInvolvment
        ccmInvolvmentOther
        ccmInvolvmentNote
        dataNeededForMonitoring
        dataNeededForMonitoringOther
        dataNeededForMonitoringNote
        dataToSendParticicipants
        dataToSendParticicipantsOther
        dataToSendParticicipantsNote
        shareCclfData
        shareCclfDataNote
      }
    }
  }
`);
