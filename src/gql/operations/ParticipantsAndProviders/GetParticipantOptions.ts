import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetParticipantOptions($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      participantsAndProviders {
        id
        expectedNumberOfParticipants
        estimateConfidence
        confidenceNote
        recruitmentMethod
        recruitmentOther
        recruitmentNote
        selectionMethod
        selectionOther
        selectionNote
      }
    }
  }
`);
