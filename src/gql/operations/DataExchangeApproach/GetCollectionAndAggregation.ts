import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCollectionAndAggregation($id: UUID!) {
    modelPlan(id: $id) {
      id
      dataExchangeApproach {
        id
        doesNeedToMakeMultiPayerDataAvailable
        anticipatedMultiPayerDataAvailabilityUseCase
        doesNeedToMakeMultiPayerDataAvailableNote
        doesNeedToCollectAndAggregateMultiSourceData
        multiSourceDataToCollect
        multiSourceDataToCollectOther
        doesNeedToCollectAndAggregateMultiSourceDataNote
      }
    }
  }
`);
