import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCommunication($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      participantsAndProviders {
        id
        participantAddedFrequency
        participantAddedFrequencyContinually
        participantAddedFrequencyOther
        participantAddedFrequencyNote
        participantRemovedFrequency
        participantRemovedFrequencyContinually
        participantRemovedFrequencyOther
        participantRemovedFrequencyNote
        communicationMethod
        communicationMethodOther
        communicationNote
        riskType
        riskOther
        riskNote
        willRiskChange
        willRiskChangeNote
      }
    }
  }
`);
