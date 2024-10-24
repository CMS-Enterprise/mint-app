import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCollectingAndSendingData($id: UUID!) {
    modelPlan(id: $id) {
      id
      dataExchangeApproach {
        id
        dataToCollectFromParticipants
        dataToCollectFromParticipantsReportsDetails
        dataToCollectFromParticipantsOther
        dataWillNotBeCollectedFromParticipants
        dataToCollectFromParticipantsNote
        dataToSendToParticipants
        dataToSendToParticipantsNote
      }
    }
  }
`);
