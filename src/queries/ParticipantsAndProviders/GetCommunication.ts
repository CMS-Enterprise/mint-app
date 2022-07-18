import { gql } from '@apollo/client';

export default gql`
  query GetCommunication($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      participantsAndProviders {
        id
        communicationMethod
        communicationMethodOther
        communicationNote
        participantAssumeRisk
        riskType
        riskOther
        riskNote
        willRiskChange
        willRiskChangeNote
      }
    }
  }
`;
