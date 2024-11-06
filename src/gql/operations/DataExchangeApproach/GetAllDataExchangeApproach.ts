import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetAllDataExchangeApproach($id: UUID!) {
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

        doesNeedToMakeMultiPayerDataAvailable
        anticipatedMultiPayerDataAvailabilityUseCase
        doesNeedToMakeMultiPayerDataAvailableNote
        doesNeedToCollectAndAggregateMultiSourceData
        multiSourceDataToCollect
        multiSourceDataToCollectOther
        doesNeedToCollectAndAggregateMultiSourceDataNote

        willImplementNewDataExchangeMethods
        newDataExchangeMethodsDescription
        newDataExchangeMethodsNote
        additionalDataExchangeConsiderationsDescription
        isDataExchangeApproachComplete
        markedCompleteByUserAccount {
          id
          commonName
        }
        markedCompleteDts
        modifiedDts
        createdDts
        status
      }
    }
  }
`);
