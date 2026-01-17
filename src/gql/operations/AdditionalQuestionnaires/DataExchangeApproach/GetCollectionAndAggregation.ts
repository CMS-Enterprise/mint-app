import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetCollectionAndAggregation($id: UUID!) {
    modelPlan(id: $id) {
      id
      questionnaires {
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
  }
`);
