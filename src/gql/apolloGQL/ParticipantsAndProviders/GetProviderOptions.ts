import { gql } from '@apollo/client';

export default gql(/* GraphQL */ `
  query GetProviderOptions($id: UUID!) {
    modelPlan(id: $id) {
      id
      modelName
      participantsAndProviders {
        id
        providerAdditionFrequency
        providerAdditionFrequencyContinually
        providerAdditionFrequencyOther
        providerAdditionFrequencyNote
        providerAddMethod
        providerAddMethodOther
        providerAddMethodNote
        providerLeaveMethod
        providerLeaveMethodOther
        providerLeaveMethodNote
        providerRemovalFrequency
        providerRemovalFrequencyContinually
        providerRemovalFrequencyOther
        providerRemovalFrequencyNote
        providerOverlap
        providerOverlapHierarchy
        providerOverlapNote
        readyForReviewByUserAccount {
          id
          commonName
        }
        readyForReviewDts
        status
      }
      operationalNeeds {
        id
        modifiedDts
      }
    }
  }
`);
