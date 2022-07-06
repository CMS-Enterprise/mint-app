import { gql } from '@apollo/client';

export default gql`
  query GetCCWAndQuality($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      opsEvalAndLearning {
        id
        ccmInvolvment
        iddocSupport
        sendFilesBetweenCcw
        sendFilesBetweenCcwNote
        appToSendFilesToKnown
        appToSendFilesToWhich
        appToSendFilesToNote
        useCcwForFileDistribiutionToParticipants
        useCcwForFileDistribiutionToParticipantsNote
        developNewQualityMeasures
        developNewQualityMeasuresNote
        qualityPerformanceImpactsPayment
        qualityPerformanceImpactsPaymentNote
      }
    }
  }
`;
